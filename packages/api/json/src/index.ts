import commentJSON from 'comment-json';
import * as declarationUpdate from 'declaration-update';
import { FsResource, GeneratorCore } from '@modern-js/codesmith';
import { editJson } from './utils';

export class JsonAPI {
  protected readonly generatorCore: GeneratorCore;

  constructor(generatorCore: GeneratorCore) {
    this.generatorCore = generatorCore;
  }

  public async get(resource: FsResource) {
    const originJsonValue = await resource.value();
    try {
      const origin = commentJSON.parse(originJsonValue.content as string);
      return origin;
    } catch (e) {
      this.generatorCore.logger.debug('[JSON API] parse json error:', e);
      throw new Error('resource content is not a legal json');
    }
  }

  public async extend(resource: FsResource, obj: Record<string, any>) {
    await editJson(this.generatorCore, resource, async () => {
      const originJsonValue = await resource.value();
      try {
        const origin = commentJSON.parse(originJsonValue.content as string);
        const newObj = commentJSON.assign(origin, obj);
        const jsonIntent = 2;
        return commentJSON.stringify(newObj, undefined, jsonIntent);
      } catch (e) {
        this.generatorCore.logger.debug('[JSON API] parse json error:', e);
        throw new Error('resource content is not a legal json');
      }
    });
  }

  public async update(
    resource: FsResource,
    operation: { query: Record<string, any>; update: Record<string, any> },
  ) {
    await editJson(this.generatorCore, resource, text => {
      try {
        const jsonContent = commentJSON.parse(text);
        declarationUpdate.query(jsonContent, operation.query, operation.update);
        const jsonIntent = 2;
        return Promise.resolve(
          commentJSON.stringify(jsonContent, undefined, jsonIntent),
        );
      } catch (e) {
        this.generatorCore.logger.debug('[JSON API] parse json error:', e);
        throw new Error('resource content is not a legal json');
      }
    });
  }
}
