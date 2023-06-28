# FS API

English | [简体中文](../../zh/api/fs.md)

The FS API is provided by the `@modern-js/codesmith-api-fs` package, which provides methods for rendering single files and folders.

## Usage

```ts
import { FsAPI } from '@modern-js/codesmith-api-fs';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const fsAPI = new FsAPI(generator);
  await fsAPI.renderFile(
    context.current!.material.get('templates/a.txt'),
    'b.txt',
  );
};
```

- Create an instance of FsAPI with the generator as the parameter.
- Call the API methods provided on the instance.

## API

### renderFile

Render a single file. It is defined as follows:

```ts
renderFile: (resource: FsResource, target: string) => Promise<void>;
```

- `resource`: Define by `context.current!.material.get(<filePath>)`.
- `target`: The target file path.

### renderDir

Batch render folders. It is defined as follows:

```ts
type TargetFunction = (globMatch: string) => string;
type RenderDirOptions = {
  nodir?: boolean;
  dot?: boolean;
  ignore?: string | readonly string[];
};
renderDir: (
  material: FsMaterial,
  findGlob: string,
  target: TargetFunction,
  options?: RenderDirOptions,
) => Promise<void>;
```

- `material`: The file resources of the current micro-generator, with a value of `context.current!.material`.
- `findGlob`: The matching rule for template files, which supports the [glob](https://www.npmjs.com/package/glob) format. For example, `templates/**/*` matches all files in the templates directory.
- `target`: The target file name, which renames files that meet the criteria. The function takes the file name as its parameter.
- `options.nodir`/`options.dot`/`options.ignore`: glob matching parameters.

Example:

```ts
const fsAPI = new FsAPI(generator);
await fsAPI.renderDir(
  context.current!.material,
  'templates/**/*',
  (resourceKey: string) =>
    resourceKey.replace('templates/', ''),
);
```
