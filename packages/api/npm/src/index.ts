import type { GeneratorCore } from '@modern-js/codesmith';
import type { ExecaReturnValue } from '@modern-js/codesmith-utils/execa';
import { npmInstall, pnpmInstall, yarnInstall } from './utils';

export * from './utils';
export class NpmAPI {
  protected readonly generatorCore: GeneratorCore;

  constructor(generatorCore: GeneratorCore) {
    this.generatorCore = generatorCore;
  }

  public npmInstall({
    cwd,
    registryUrl,
    ignoreScripts,
  }: {
    cwd?: string;
    registryUrl?: string;
    ignoreScripts?: boolean;
    useNvm?: boolean;
  }): Promise<ExecaReturnValue> {
    return npmInstall({
      cwd: cwd || this.generatorCore.outputPath,
      registryUrl,
      ignoreScripts,
    });
  }

  public yarnInstall({
    cwd,
    registryUrl,
    ignoreScripts,
  }: {
    cwd?: string;
    registryUrl?: string;
    ignoreScripts?: boolean;
    useNvm?: boolean;
  }): Promise<ExecaReturnValue> {
    return yarnInstall({
      cwd: cwd || this.generatorCore.outputPath,
      registryUrl,
      ignoreScripts,
    });
  }

  public pnpmInstall({
    cwd,
    registryUrl,
    ignoreScripts,
  }: {
    cwd?: string;
    registryUrl?: string;
    ignoreScripts?: boolean;
    useNvm?: boolean;
  }): Promise<ExecaReturnValue> {
    return pnpmInstall({
      cwd: cwd || this.generatorCore.outputPath,
      registryUrl,
      ignoreScripts,
    });
  }
}
