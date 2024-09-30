import path from 'path';
import type { Logger } from '@/logger';
import {
  downloadPackage,
  getGeneratorVersion,
  getPackageInfo,
  nodeRequire,
} from '@/utils';
import { FsMaterial } from './FsMaterial';

export class MaterialsManager {
  logger?: Logger;

  registryUrl?: string;

  materialMap: {
    [materialUri: string]: FsMaterial;
  };

  constructor(logger?: Logger, registryUrl?: string) {
    this.logger = logger;
    this.registryUrl = registryUrl;
    this.materialMap = {};
  }

  loadLocalGenerator(generator: string): Promise<FsMaterial> {
    if (!path.isAbsolute(generator)) {
      return Promise.reject(new Error('only support absolute local path'));
    }
    const fsMaterial = new FsMaterial(generator);
    this.materialMap[generator] = fsMaterial;
    return Promise.resolve(fsMaterial);
  }

  async loadRemoteGenerator(generator: string): Promise<FsMaterial> {
    const { name, version } = getPackageInfo(generator);
    const localPath = await downloadPackage(name, version, {
      registryUrl: this.registryUrl,
      install: true,
      logger: this.logger,
    });
    const pkgJson = nodeRequire(`${localPath}/package.json`);
    const materialKey = `${pkgJson.name}@${pkgJson.version}`;
    this.materialMap[materialKey] = new FsMaterial(localPath);
    return Promise.resolve(this.materialMap[materialKey]);
  }

  async prepareGenerators(generators: string[]) {
    this.logger?.timing?.('🕒 Prepare Generators');
    await Promise.all(
      generators.map(async generator => {
        const { name, version: pkgVersion } = getPackageInfo(generator);
        const version = await getGeneratorVersion(name, pkgVersion, {
          registryUrl: this.registryUrl,
          logger: this.logger,
        });
        const materialKey = `${name}@${version}`;
        if (this.materialMap[materialKey] || generator.startsWith('file:')) {
          return Promise.resolve();
        }
        await this.loadRemoteGenerator(materialKey);
      }),
    );
    this.logger?.timing?.('🕒 Prepare Generators', true);
  }

  async prepareGlobal() {
    this.logger?.timing?.('🕒 Prepare Global');
    const globalPkgName = '@modern-js/codesmith-global';
    const globalResource = await this.loadRemoteGenerator(
      `${globalPkgName}@latest`,
    );
    require(globalResource.basePath);
    this.logger?.timing?.('🕒 Prepare Global', true);
  }
}
