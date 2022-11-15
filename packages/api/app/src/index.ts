import { fs, execa, semver } from '@modern-js/utils';
import { merge } from '@modern-js/utils/lodash';
import { parse, stringify } from 'comment-json';
import { GeneratorCore, GeneratorContext } from '@modern-js/codesmith';
import {
  NpmAPI,
  canUsePnpm,
  canUseYarn,
  canUseNpm,
} from '@modern-js/codesmith-api-npm';
import { GitAPI } from '@modern-js/codesmith-api-git';
import { HandlebarsAPI } from '@modern-js/codesmith-api-handlebars';
import { EjsAPI } from '@modern-js/codesmith-api-ejs';
import {
  Schema as FormilySchema,
  CLIReader as FormilyCLIReader,
} from '@modern-js/codesmith-formily';
import inquirer, { Question } from 'inquirer';
import { I18n, i18n, localeKeys } from './locale';
import { transformInquirerSchema } from './utils/transform';

export class AppAPI {
  i18n: I18n = i18n;

  protected readonly generatorCore: GeneratorCore;

  protected readonly generatorContext: GeneratorContext;

  private readonly npmApi: NpmAPI;

  private readonly gitApi: GitAPI;

  private readonly handlebarsAPI: HandlebarsAPI;

  private readonly ejsAPI: EjsAPI;

  constructor(
    generatorContext: GeneratorContext,
    generatorCore: GeneratorCore,
  ) {
    this.generatorCore = generatorCore;
    this.generatorContext = generatorContext;
    this.npmApi = new NpmAPI(generatorCore);
    this.gitApi = new GitAPI(generatorCore, generatorContext);
    this.handlebarsAPI = new HandlebarsAPI(generatorCore);
    this.ejsAPI = new EjsAPI(generatorCore);
  }

  public async checkEnvironment(nodeVersion?: string) {
    if (semver.lt(process.versions.node, nodeVersion || '12.22.12')) {
      this.generatorCore.logger.warn(
        i18n.t(localeKeys.environment.node_version),
      );
      return false;
    }
    if (
      !(await canUseYarn()) &&
      !(await canUsePnpm()) &&
      !(await canUseNpm())
    ) {
      this.generatorCore.logger.debug("can't use yarn or pnpm or npm");
      this.generatorCore.logger.warn(
        i18n.t(localeKeys.environment.yarn_pnpm_npm),
      );
      return false;
    }
    return true;
  }

  // support custom install command
  public async runInstall(
    command?: string,
    options?: {
      cwd?: string;
      registryUrl?: string;
      ignoreScripts?: boolean;
    },
  ) {
    const {
      config: { packageManager, noNeedInstall },
    } = this.generatorContext;
    if (noNeedInstall || process.env.NoNeedInstall === 'true') {
      return;
    }
    let intallPromise;
    if (command) {
      intallPromise = execa(command);
    } else if (packageManager === 'pnpm') {
      intallPromise = this.npmApi.pnpmInstall(options || {});
    } else if (packageManager === 'yarn') {
      intallPromise = this.npmApi.yarnInstall(options || {});
    } else {
      intallPromise = this.npmApi.npmInstall(options || {});
    }
    try {
      await intallPromise;
      this.generatorCore.logger.info(i18n.t(localeKeys.install.success));
    } catch (e) {
      this.generatorCore.logger.warn(
        i18n.t(localeKeys.install.failed, {
          command: command || `${packageManager} install`,
        }),
      );
    }
  }

  // custom install func
  public async runGitAndInstall(
    commitMessage?: string,
    installFunc?: () => Promise<void>,
  ) {
    const {
      config: { isMonorepoSubProject = false, noNeedGit },
    } = this.generatorContext;

    const customNoNeedGit = noNeedGit || process.env.NoNeedGit === 'true';

    const inGitRepo = isMonorepoSubProject || (await this.gitApi.isInGitRepo());

    if (!inGitRepo && !customNoNeedGit) {
      await this.gitApi.initGitRepo();
    }

    try {
      if (installFunc) {
        await installFunc();
      } else {
        await this.runInstall();
      }
    } catch (e) {
      this.generatorCore.logger.debug('Dependencies install failed', e);
      this.generatorCore.logger.warn(
        i18n.t(localeKeys.install.failed_no_command),
      );
    }

    try {
      if (!isMonorepoSubProject && !customNoNeedGit) {
        await this.gitApi.addAndCommit(commitMessage || 'feat: init');
        this.generatorCore.logger.info(i18n.t(localeKeys.git.success));
      }
    } catch (e) {
      this.generatorCore.logger.debug('Git repository create failed', e);
      this.generatorCore.logger.warn(i18n.t(localeKeys.git.failed));
    }
  }

  public async forgeTemplate(
    templatePattern: string,
    filter?: (resourceKey: string) => boolean,
    rename?: (resourceKey: string) => string,
    parameters?: Record<string, any>,
    type: 'handlebars' | 'ejs' = 'handlebars',
  ) {
    try {
      const { material } = this.generatorContext.current!;
      const resourceMap = await material.find(templatePattern, {
        nodir: true,
        dot: true,
      });
      if (resourceMap) {
        const api = type === 'ejs' ? this.ejsAPI : this.handlebarsAPI;
        await Promise.all(
          Object.keys(resourceMap)
            .filter(resourceKey => (filter ? filter(resourceKey) : true))
            .map(async resourceKey => {
              this.generatorCore.logger.debug(
                `[renderDir] resourceKey=${resourceKey}`,
              );
              const target = rename
                ? rename(resourceKey)
                : resourceKey
                    .replace(`templates/`, '')
                    .replace('.handlebars', '');
              await api.renderTemplate(material.get(resourceKey), target, {
                ...(this.generatorContext.data || {}),
                ...(parameters || {}),
              });
            }),
        );
      }
    } catch (e) {
      this.generatorCore.logger.debug('base forging failed:', e);
      this.generatorCore.logger.warn(i18n.t(localeKeys.templated.failed));
      throw new Error('base forging failed');
    }
  }

  public async updateWorkspace(
    folder: {
      name: string;
      path: string;
    },
    workspaceName = 'monorepo.code-workspace',
  ) {
    const { filePath } =
      this.generatorContext.materials.default.get(workspaceName);

    if (!fs.existsSync(filePath)) {
      return;
    }

    const content = await fs.readFile(filePath);
    const workspace = parse(content.toString()) as Record<string, any>;
    workspace.folders = [folder, ...(workspace.folders || [])];
    const indent = 2;
    await fs.writeFile(filePath, stringify(workspace, null, indent), {
      encoding: 'utf-8',
    });
  }

  public showSuccessInfo(successInfo?: string) {
    this.generatorCore.logger.info(
      successInfo || i18n.t(localeKeys.success.info),
    );
  }

  public async runSubGenerator(
    subGenerator: string,
    relativePwdPath?: string,
    config?: Record<string, unknown>,
  ) {
    try {
      await this.generatorCore.runSubGenerator(
        subGenerator,
        relativePwdPath,
        config,
      );
    } catch (e) {
      this.generatorCore.logger.warn(i18n.t(localeKeys.generator.failed));
      this.generatorCore.logger.debug(i18n.t(localeKeys.generator.failed), e);
      throw new Error('run sub generator failed');
    }
  }

  private mergeAnswers(
    answers: Record<string, any>,
    configValue: Record<string, any>,
  ) {
    const inputData = merge(answers, configValue);
    this.generatorContext.config = merge(
      this.generatorContext.config,
      inputData,
    );
    return inputData;
  }

  public async getInputBySchemaFunc(
    schemaFunc: (config?: Record<string, any>) => FormilySchema,
    configValue: Record<string, unknown> = {},
    validateMap: Record<
      string,
      (
        input: unknown,
        data?: Record<string, unknown>,
      ) => { success: boolean; error?: string }
    > = {},
    initValue: Record<string, any> = {},
  ) {
    const reader = new FormilyCLIReader({
      schema: schemaFunc(configValue),
      validateMap,
      initValue,
    });
    reader.setAnswers(configValue);
    const answers = await reader.start();
    return this.mergeAnswers(answers, configValue);
  }

  /**
   * questions input
   * @param schema Questions schema
   * @param configValue Default config. When the question's key is in configValue, it will not show.
   * @param validateMap Question validate function map
   * @param initValue Initial value. Even the question's key is in initValue, it alse show in question list.
   * @returns
   */
  public async getInputBySchema(
    schema: FormilySchema | Question[],
    type: 'formily' | 'inquirer' = 'formily',
    configValue: Record<string, unknown> = {},
    validateMap: Record<
      string,
      (
        input: unknown,
        data?: Record<string, unknown>,
      ) => { success: boolean; error?: string }
    > = {},
    initValue: Record<string, any> = {},
  ) {
    if (type === 'formily') {
      const reader = new FormilyCLIReader({
        schema: schema as FormilySchema,
        validateMap,
        initValue,
      });
      reader.setAnswers(configValue);
      const answers = await reader.start();
      return this.mergeAnswers(answers, configValue);
    } else {
      const answers = await inquirer.prompt(
        transformInquirerSchema(
          schema as Question[],
          configValue,
          validateMap,
          initValue,
        ),
      );
      return this.mergeAnswers(answers, configValue);
    }
  }
}
