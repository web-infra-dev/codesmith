import path from 'path';
import { GeneratorCore } from '@/generator';
import { Logger } from '@/logger';
import { LoggerLevel } from '@/logger/constants';
import { MaterialsManager } from '@/materials';
import { FsMaterial } from '@/materials/FsMaterial';
import type { ForgeOptions, ForgeTask } from './constants';

interface ICreateOptions {
  debug?: boolean;
  time?: boolean;
  logger?: Logger;
  // custom npm registry
  registryUrl?: string;
  namespace?: string;
}

export class CodeSmith {
  core?: GeneratorCore;

  materialsManager: MaterialsManager;

  // current mode is debug mode
  debug = false;

  logger: Logger;

  constructor({ debug, time, logger, registryUrl, namespace }: ICreateOptions) {
    this.debug = debug || false;
    this.logger =
      logger ||
      new Logger(
        debug
          ? LoggerLevel.Debug
          : time
            ? LoggerLevel.Timing
            : LoggerLevel.Info,
        namespace,
      );
    this.materialsManager = new MaterialsManager(this.logger, registryUrl);
  }

  public async forge({ tasks, pwd }: ForgeOptions) {
    this.logger?.timing?.('CodeSmith all tasks');
    this.core = new GeneratorCore({
      logger: this.logger,
      materialsManager: this.materialsManager,
      outputPath: pwd || process.cwd(),
    });
    this.core.addMaterial(
      'default',
      new FsMaterial(path.resolve(pwd || process.cwd())),
    );
    try {
      for (const task of tasks) {
        await this.runTask(task);
      }
    } catch (e: unknown) {
      this.logger.error('[Run Forge Generator Error]:', e);
      throw new Error('run task error');
    } finally {
      this.logger?.timing?.('CodeSmith all tasks', true);
    }
  }

  private async runTask(task: ForgeTask) {
    if (!this.core) {
      throw new Error("no core in 'runTask'");
    }
    const { generator, config } = task;
    this.logger?.timing?.(`runTask ${generator}`);
    await this.core.runGenerator(generator, config);
    this.logger?.timing?.(`runTask ${generator}`, true);
  }
}
