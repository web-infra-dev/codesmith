import type { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';
import { EjsAPI } from '@modern-js/codesmith-api-ejs';
import { FsAPI } from '@modern-js/codesmith-api-fs';
import { GitAPI } from '@modern-js/codesmith-api-git';
import { HandlebarsAPI } from '@modern-js/codesmith-api-handlebars';
import {
  NpmAPI,
  canUseNpm,
  canUsePnpm,
  canUseYarn,
} from '@modern-js/codesmith-api-npm';
import {
  CLIReader as FormilyCLIReader,
  type Schema as FormilySchema,
} from '@modern-js/codesmith-formily';
import { execa } from '@modern-js/codesmith-utils/execa';
import { fs } from '@modern-js/codesmith-utils/fs-extra';
import { merge } from '@modern-js/codesmith-utils/lodash';
import { semver } from '@modern-js/codesmith-utils/semver';
import { parse, stringify } from 'comment-json';
import inquirer, { type Question } from 'inquirer';
import { type I18n, i18n, localeKeys } from './locale';
import { checkUseNvm } from './utils/checkUseNvm';
import { transformInquirerSchema } from './utils/transform';

export class AppAPI {
  i18n: I18n = i18n;

  npmApi: NpmAPI;

  gitApi: GitAPI;

  handlebarsAPI: HandlebarsAPI;

  ejsAPI: EjsAPI;

  fsAPI: FsAPI;

  protected readonly generatorCore: GeneratorCore;

  protected readonly generatorContext: GeneratorContext;

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
    this.fsAPI = new FsAPI(generatorCore);
  }

  public async checkEnvironment(nodeVersion?: string) {
    if (semver.lt(process.versions.node, nodeVersion || '16.20.2')) {
      this.generatorCore.logger.warn(
        `🟡 ${i18n.t(localeKeys.environment.node_version)}`,
      );
      return false;
    }
    if (
      !(await canUseYarn()) &&
      !(await canUsePnpm()) &&
      !(await canUseNpm())
    ) {
      this.generatorCore.logger.debug(
        "🧐 [Check Environment] Can't use yarn or pnpm or npm",
      );
      this.generatorCore.logger.warn(
        `🟡 ${i18n.t(localeKeys.environment.yarn_pnpm_npm)}`,
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
    this.generatorCore.logger?.timing?.('🕒 Run Install');
    const {
      config: { packageManager, noNeedInstall, noNeedCheckNvm },
    } = this.generatorContext;
    if (noNeedInstall || process.env.NoNeedInstall === 'true') {
      return;
    }
    let useNvm = false;
    if (!noNeedCheckNvm && process.env.NoNeedCheckNvm !== 'true') {
      // check nvm
      useNvm = await checkUseNvm(
        options?.cwd || this.generatorCore.outputPath,
        this.generatorCore.logger,
      );
    }
    let intallPromise: any;
    if (command) {
      intallPromise = execa(command, [], {
        shell: true,
        stdin: 'inherit',
        stdout: 'inherit',
        stderr: 'inherit',
        ...(options || {}),
      });
    } else if (packageManager === 'pnpm') {
      intallPromise = this.npmApi.pnpmInstall({ ...(options || {}), useNvm });
    } else if (packageManager === 'yarn') {
      intallPromise = this.npmApi.yarnInstall({ ...(options || {}), useNvm });
    } else {
      intallPromise = this.npmApi.npmInstall({ ...(options || {}), useNvm });
    }
    try {
      await intallPromise;
      this.generatorCore.logger.info(i18n.t(localeKeys.install.success));
    } catch (e) {
      this.generatorCore.logger.warn(e);
      this.generatorCore.logger.warn(
        `🟡 ${i18n.t(localeKeys.install.failed, {
          command: command || `${packageManager} install`,
        })}`,
      );
    }
    this.generatorCore.logger?.timing?.('🕒 Run Install', true);
  }

  // custom install func
  public async runGitAndInstall(
    commitMessage?: string,
    installFunc?: () => Promise<void>,
  ) {
    this.generatorCore.logger?.timing?.('🕒 Run Git and Install');
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
      this.generatorCore.logger.debug('❗️ [Run Install Failed]:', e);
      this.generatorCore.logger.warn(
        `🟡 ${i18n.t(localeKeys.install.failed_no_command)}`,
      );
    }

    try {
      if (!isMonorepoSubProject && !customNoNeedGit && !inGitRepo) {
        await this.gitApi.addAndCommit(commitMessage || 'feat: init');
        this.generatorCore.logger.info(i18n.t(localeKeys.git.success));
      }
    } catch (e) {
      this.generatorCore.logger.debug('❗️ [Git Add and Commit Failed]:', e);
      this.generatorCore.logger.warn(`🟡 ${i18n.t(localeKeys.git.failed)}`);
    }
    this.generatorCore.logger?.timing?.('🕒 Run Git and Install', true);
  }

  public async forgeTemplate(
    templatePattern: string,
    filter?: (resourceKey: string) => boolean,
    rename?: (resourceKey: string) => string,
    parameters?: Record<string, any>,
    type: 'handlebars' | 'ejs' = 'handlebars',
  ) {
    try {
      this.generatorCore.logger?.timing?.('🕒 ForgeTemplate');
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
                `💡 [Forge Template]: resourceKey=${resourceKey}`,
              );
              const target = rename
                ? rename(resourceKey)
                : resourceKey
                    .replace('templates/', '')
                    .replace('.handlebars', '')
                    .replace('.ejs', '');
              await api.renderTemplate(material.get(resourceKey), target, {
                ...(this.generatorContext.data || {}),
                ...(parameters || {}),
              });
            }),
        );
      }
    } catch (e) {
      this.generatorCore.logger.debug('❗️ [Forge Template Failed]:', e);
      this.generatorCore.logger.warn(
        `🟡 ${i18n.t(localeKeys.templated.failed)}`,
      );
      throw new Error('Forge Template Failed');
    } finally {
      this.generatorCore.logger?.timing?.('🕒 ForgeTemplate', true);
    }
  }

  public async renderTemplateByFileType(
    templatePattern: string,
    filter?: (resourceKey: string) => boolean,
    rename?: (resourceKey: string) => string,
    parameters?: Record<string, any>,
  ) {
    try {
      this.generatorCore.logger?.timing?.('🕒 RenderTemplateByFileType');
      const { material } = this.generatorContext.current!;
      const resourceMap = await material.find(templatePattern, {
        nodir: true,
        dot: true,
      });
      if (resourceMap) {
        await Promise.all(
          Object.keys(resourceMap)
            .filter(resourceKey => (filter ? filter(resourceKey) : true))
            .map(async resourceKey => {
              this.generatorCore.logger.debug(
                `💡 [Forge Template by Type]: resourceKey=${resourceKey}`,
              );
              if (resourceKey.includes('.handlebars')) {
                const target = rename
                  ? rename(resourceKey)
                  : resourceKey
                      .replace('templates/', '')
                      .replace('.handlebars', '');
                await this.handlebarsAPI.renderTemplate(
                  material.get(resourceKey),
                  target,
                  {
                    ...(this.generatorContext.data || {}),
                    ...(parameters || {}),
                  },
                );
              } else if (resourceKey.includes('.ejs')) {
                const target = rename
                  ? rename(resourceKey)
                  : resourceKey.replace('templates/', '').replace('.ejs', '');
                await this.ejsAPI.renderTemplate(
                  material.get(resourceKey),
                  target,
                  {
                    ...(this.generatorContext.data || {}),
                    ...(parameters || {}),
                  },
                );
              } else {
                const target = rename
                  ? rename(resourceKey)
                  : resourceKey.replace('templates/', '');
                await this.fsAPI.renderFile(material.get(resourceKey), target);
              }
            }),
        );
      }
    } catch (e) {
      this.generatorCore.logger.debug('❗️ [Forge Template by Type Failed]:', e);
      this.generatorCore.logger.warn(
        `🟡 ${i18n.t(localeKeys.templated.failed)}`,
      );
      throw new Error('Forge Template by Type Failed');
    } finally {
      this.generatorCore.logger?.timing?.('🕒 RenderTemplateByFileType', true);
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
      this.generatorCore.logger.warn(
        `🟡 ${i18n.t(localeKeys.generator.failed)}`,
      );
      this.generatorCore.logger.debug(
        '❗️ [Runtime sub Generator Failed]:',
        subGenerator,
        e,
      );
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
    }
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
