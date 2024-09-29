import { EventEmitter } from 'events';
import path from 'path';
import type { Logger } from '@/logger';
import type { ILogger } from '@/logger/constants';
import type { MaterialsManager } from '@/materials';
import { FsMaterial } from '@/materials/FsMaterial';
import { getGeneratorVersion, getPackageInfo, nodeRequire } from '@/utils';
import { getGeneratorDir } from '@/utils/getGeneratorDir';
import { chalk } from '@modern-js/codesmith-utils/chalk';
import { fs } from '@modern-js/codesmith-utils/fs-extra';
import { ora } from '@modern-js/codesmith-utils/ora';
import type { GeneratorContext, RuntimeCurrent } from './constants';

interface ICreateOptions {
  logger: Logger;
  materialsManager: MaterialsManager;
  outputPath: string;
}

export class GeneratorCore {
  logger: ILogger;

  materialsManager: MaterialsManager;

  outputPath: string;

  basePath: string;

  output: {
    fs: (
      file: string | number,
      data: any,
      options?: fs.WriteFileOptions | string,
    ) => Promise<void>;
  } = {
    fs: async (file, content, options) => {
      const filePath = path.resolve(this.outputPath, file.toString());
      await fs.mkdirp(path.dirname(filePath));
      await fs.writeFile(filePath, content, options);
    },
  };

  _context: GeneratorContext;

  // event handles, to handle generator lifecycle
  event: EventEmitter;

  constructor({ logger, materialsManager, outputPath }: ICreateOptions) {
    this.logger = logger;
    this.materialsManager = materialsManager;
    this.outputPath = outputPath;
    this.basePath = process.cwd();
    this.event = new EventEmitter();
    this.event.setMaxListeners(15);
    this._context = {
      materials: {},
      config: {},
      data: {},
      current: null,
      ...this.lifeCycleMethod,
    };
  }

  private get lifeCycleMethod() {
    return {
      handleForged: this.handleForged.bind(this),
    };
  }

  private setConfig(config: Record<string, any>) {
    this._context.config = config;
  }

  public addMaterial(key: string, material: FsMaterial) {
    this._context.materials[key] = material;
  }

  private setCurrent(current: RuntimeCurrent | null) {
    this._context.current = current;
  }

  private setOutputPath(outputPath: string) {
    this.outputPath = outputPath;
  }

  private setbasePath(basePath: string) {
    this.basePath = basePath;
  }

  private async loadLocalGenerator(generator: string) {
    this.logger.debug('⏳ [Load Local Generator]:', generator);
    let generatorPkg: FsMaterial;
    let pkgJson: Record<string, any>;
    try {
      const generatorDir = await getGeneratorDir(generator);
      generatorPkg =
        await this.materialsManager.loadLocalGenerator(generatorDir);
    } catch (e) {
      this.logger.debug('❗️[Load Local Generator Error]:', e);
      return { generatorPkg: null };
    }
    // check package.json file exist
    try {
      pkgJson = nodeRequire(generatorPkg.get('package.json').filePath);
    } catch (e) {
      this.logger.error(`🔴 [Load Generator ${generator} Error]:`, e);
      this.logger.warn(
        `🟡 [Load Local Generator Error]: generator need a \`package.json\` in top directory
check path: ${chalk.blue.underline(
          generator,
        )} exist a package.json file or not`,
      );
      return {
        generatorPkg: null,
      };
    }
    this.logger.debug(
      '⌛ [Load Local Generator Success]:',
      `v${pkgJson.version}`,
    );
    const materialKey = `${pkgJson.name}@local`;
    return {
      generatorPkg,
      pkgJson,
      materialKey,
    };
  }

  private async loadRemoteGenerator(generator: string) {
    this.logger.debug('💡 [Load Remote Generator]:', generator);
    try {
      const { name, version: pkgVersion } = getPackageInfo(generator);
      const version = await getGeneratorVersion(name, pkgVersion, {
        registryUrl: this.materialsManager.registryUrl,
        logger: this.logger,
      });
      const materialKey = `${name}@${version}`;
      const generatorPkg =
        this.materialsManager.materialMap[materialKey] ||
        (await this.materialsManager.loadRemoteGenerator(generator));
      const pkgJson = nodeRequire(generatorPkg.get('package.json').filePath);
      this.logger.debug(
        '🌟 [Load Remote Generator Success]:',
        generator,
        pkgJson.version,
      );
      return { generatorPkg, pkgJson, materialKey };
    } catch (e) {
      this.logger.error(`❗️ [Load Generator ${generator} Error]:`, e);
      return { generatorPkg: null };
    }
  }

  // when generator has finish forge template file, can trigger this function to emit `forged` event
  handleForged(
    generatorName: string,
    context: {
      materials: { default: { basePath: string } };
      data: Record<string, unknown>;
      config: Record<string, unknown>;
    },
    // the flag is marked whether need to wait `handle forged success` event
    needWait = false,
    projectPath = '',
  ) {
    if (needWait) {
      this.event.emit(
        'forged',
        generatorName,
        context.materials.default.basePath,
        { ...context.data, ...context.config },
        projectPath,
        this,
      );
      return new Promise((resolve, reject) => {
        try {
          this.event.on('handle forged success', resolve);
        } catch (e) {
          reject(e);
        }
      });
    }
    return Promise.resolve();
  }

  async loadGenerator(generator: string) {
    this.logger?.timing?.(`🕒 LoadGenerator ${generator}`);
    let generatorPath = generator;
    if (generator.startsWith('file:')) {
      generatorPath = path.join(this.basePath, generator.slice(5));
    }
    const loadGeneratorPromise = path.isAbsolute(generatorPath)
      ? this.loadLocalGenerator(generatorPath)
      : this.loadRemoteGenerator(generator);
    const { generatorPkg, pkgJson, materialKey } = await loadGeneratorPromise;
    if (!generatorPkg || !pkgJson || !materialKey) {
      return {};
    }
    this.logger.debug('💡 [runGenerator] task.generator loaded');
    this.logger?.timing?.(`🕒 LoadGenerator ${generator}`, true);

    const generatorScript = nodeRequire(generatorPkg.basePath);
    if (typeof generatorScript !== 'function') {
      this.logger.debug(
        `❗️ [Generator Error]: generator module [${pkgJson.name}] export default is not a function`,
        generatorScript,
      );
      throw new Error(
        `generator module [${pkgJson.name}] export default is not a function`,
      );
    }
    return {
      materialKey,
      generatorPkg,
      generatorScript,
    };
  }

  async runGenerator(generator: string, config: Record<string, unknown> = {}) {
    this.logger?.timing?.(`🕒 RunGenerator ${generator}`);
    const spinner = ora({
      text: 'Load Generator...\n',
      spinner: 'runner',
    }).start();
    const { materialKey, generatorPkg, generatorScript } =
      await this.loadGenerator(generator);
    if (!materialKey || !generatorPkg) {
      throw new Error('load generator failed');
    }
    this.addMaterial(materialKey, generatorPkg);
    this.setConfig(config || {});

    // run generator
    this.setCurrent({
      material: generatorPkg,
    });
    spinner.stop();
    this.setbasePath(this._context.current!.material.basePath!);
    await generatorScript(this._context, this);
    this.setCurrent(null);
    this.logger?.timing?.(`🕒 RunGenerator ${generator}`, true);
  }

  async runSubGenerator(
    subGenerator: string,
    relativePwdPath = '',
    config?: Record<string, any>,
  ) {
    this.logger?.timing?.(`🕒 RunSubGenerator ${subGenerator}`);
    const spinner = ora({
      text: 'Load Generator...\n',
      spinner: 'runner',
    }).start();
    const { materialKey, generatorPkg, generatorScript } =
      await this.loadGenerator(subGenerator);
    if (!materialKey || !generatorPkg) {
      throw new Error('load generator failed');
    }
    this.addMaterial(materialKey, generatorPkg);
    const subContext = {
      ...this._context,
      config: {
        ...this._context.config,
        ...config,
      },
      materials: {
        ...this._context.materials,
        default: new FsMaterial(path.resolve(this.outputPath, relativePwdPath)),
      },
      current: {
        material: generatorPkg,
      },
    };
    const preOutputPath = this.outputPath;
    const preBasePath = this.basePath;
    this.setOutputPath(path.resolve(this.outputPath, relativePwdPath || ''));
    this.setbasePath(subContext.current.material.basePath);
    spinner.stop();
    await generatorScript(subContext, this);
    this.setOutputPath(preOutputPath);
    this.setbasePath(preBasePath);
    this.logger?.timing?.(`🕒 RunSubGenerator ${subGenerator}`, true);
  }

  public async prepareGenerators(generators: string[]) {
    await this.materialsManager.prepareGenerators(generators);
  }
}
