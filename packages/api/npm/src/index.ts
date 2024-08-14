import type { GeneratorCore } from '@modern-js/codesmith';
import { npmInstall, yarnInstall, pnpmInstall } from './utils';

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
  }) {
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
  }) {
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
  }) {
    return pnpmInstall({
      cwd: cwd || this.generatorCore.outputPath,
      registryUrl,
      ignoreScripts,
    });
  }
}
