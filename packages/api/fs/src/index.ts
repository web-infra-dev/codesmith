import path from 'path';
import {
  FS_RESOURCE,
  type FsMaterial,
  type FsResource,
  type GeneratorCore,
} from '@modern-js/codesmith';
import { fs } from '@modern-js/codesmith-utils/fs-extra';

type RenderDirOptions = {
  nodir?: boolean;
  dot?: boolean;
  ignore?: string | readonly string[];
};

type TargetFunction = (globMatch: string) => string;

export class FsAPI {
  protected readonly generatorCore: GeneratorCore;

  constructor(generatorCore: GeneratorCore) {
    this.generatorCore = generatorCore;
  }

  public async renderFile(resource: FsResource, target: string) {
    if (resource._type !== FS_RESOURCE) {
      throw new Error('resource not match');
    }
    const filePath = path.resolve(
      this.generatorCore.outputPath,
      target.toString(),
    );
    await fs.mkdirp(path.dirname(filePath));
    await fs.copyFile(resource.filePath, filePath);
  }

  public async renderDir(
    material: FsMaterial,
    findGlob: string,
    target: TargetFunction,
    options?: RenderDirOptions,
  ) {
    const resourceMap = await material.find(findGlob, {
      nodir: true,
      ...options,
    });
    await Promise.all(
      Object.keys(resourceMap).map(async resourceKey => {
        this.generatorCore.logger.debug(
          `💡 [FS Render Dir]: resourceKey=${resourceKey}`,
        );
        await this.renderFile(material.get(resourceKey), target(resourceKey));
      }),
    );
  }
}
