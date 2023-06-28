# JSON API

English | [简体中文](../../zh/api/json.md)

The JSON API is provided by the `@modern-js/codesmith-api-json` package, which provides methods for obtaining JSON file content, updating JSON files, etc.

## Usage

```ts
import { JsonAPI } from '@modern-js/codesmith-api-json';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const jsonAPI = new JsonAPI(generator);
  await jsonAPI.update(context.materials.default.get('package.json'), {
    query: {},
    update: {
      $set: {
        'dependencies.@modern-js/plugin-bff': `^2.0.0`,
      },
    },
  });
};
```

- Create an instance of JsonAPI with the generator as the parameter.
- Call the API methods provided on the instance.

## API

### get

Get the content of a JSON file. It is defined as follows:

```ts
get: (resource: FsResource) => Promise<Record<string, any>>;
```

- `resource`: Defined by `context.materials.default.get(<filePath>)`.

### extend

Merge an object into a JSON file. It is defined as follows:

```ts
extend(resource: FsResource, obj: Record<string, any>): Promise<void>;
```

- `resource`: Defined by `context.materials.default.get(<filePath>)`.
- `obj`: The object to be merged.

### update

Update the fields of an object into a JSON file. It is defined as follows:

```ts
update(resource: FsResource, operation: {
    query: Record<string, any>;
    update: Record<string, any>;
  }): Promise<void>;
```

- `resource`: Defined `context.materials.default.get(<filePath>)`.
- `operation`: The update operation, which can be found in detail in [declaration-update](https://www.npmjs.com/package/declaration-update).
