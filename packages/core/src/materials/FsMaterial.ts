import path from 'path';
import glob from 'glob-promise';
import { FsResource } from './FsResource';

export class FsMaterial {
  basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  get(resourceKey: string) {
    return new FsResource(
      path.resolve(this.basePath, resourceKey),
      resourceKey,
    );
  }

  async find(
    globStr: string,
    options?: {
      nodir?: boolean;
      dot?: boolean;
      ignore?: string | readonly string[];
    },
  ): Promise<Record<string, FsResource>> {
    const matches = await glob(globStr, {
      cwd: path.resolve(this.basePath),
      nodir: options?.nodir,
      dot: options?.dot,
      ignore: options?.ignore,
    });
    return matches.reduce<Record<string, FsResource>>((pre, cur) => {
      pre[cur] = new FsResource(path.resolve(this.basePath, cur), cur);
      return pre;
    }, {});
  }
}
