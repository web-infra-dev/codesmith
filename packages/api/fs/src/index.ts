import path from 'path';
import {
  FsMaterial,
  FsResource,
  FS_RESOURCE,
  GeneratorCore,
} from '@modern-js/codesmith';
import { imageExtNameList } from './constant';

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
    const resourceValue = await resource.value();
    const resourceFileExt = path.extname(resource.filePath);
    if (imageExtNameList.includes(resourceFileExt)) {
      // is the file content is image, use binary encoding
      await this.generatorCore.output.fs(target, resourceValue.content, {
        encoding: 'binary',
      });
    } else {
      await this.generatorCore.output.fs(target, resourceValue.content, {
        encoding: 'utf-8',
      });
    }
  }

  public async renderDir(
    material: FsMaterial,
    findGlob: string,
    target: TargetFunction,
    options?: RenderDirOptions,
  ) {
    const resourceMap = await material.find(findGlob, options);
    await Promise.all(
      Object.keys(resourceMap).map(async resourceKey => {
        this.generatorCore.logger.debug(
          `[renderDir] resourceKey=${resourceKey}`,
        );
        await this.renderFile(material.get(resourceKey), target(resourceKey));
      }),
    );
  }
}
