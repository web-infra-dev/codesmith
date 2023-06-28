# EJS API

English | [简体中文](../../zh/api/ejs.md)

The EJS API is provided by the `@modern-js/codesmith-api-ejs` package, which provides methods for rendering single files and folders using [EJS](https://ejs.co/).

## Usage

```ts
import { EjsAPI } from '@modern-js/codesmith-api-ejs';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const ejsAPI = new EjsAPI(generator);
  await ejsAPI.renderTemplate(
    context.current!.material.get('templates/a.js.ejs'),
    'b.js',
    { name: 'test ejs' },
  );
};
```

- Create an instance of EjsAPI with the generator as the parameter.
- Call the API methods provided on the instance.

## API

### renderTemplate

Render a single EJS template file. It is defined as follows:

```ts
renderTemplate: (
  templateResource: FsResource,
  target: string,
  parameters?: Record<string, string>,
) => Promise<void>;
```

- `templateResource`: The template file, defined by `context.current!.material.get(<filePath>)`.
- `target`: The target file path.
- `parameters`: The values of template variables. When EJS variables exist in the template, define the corresponding variable values.

### renderTemplateDir

Batch render EJS template folders. It is defined as follows:

```ts
type TargetFunction = (globMatch: string) => string;
type RenderTemplateDirOptions = {
  nodir?: boolean;
  dot?: boolean;
  ignore?: string | readonly string[];
  parameters?: Record<string, string>;
};
renderTemplateDir: (
  material: FsMaterial,
  findGlob: string,
  target: TargetFunction,
  options?: RenderTemplateDirOptions,
) => Promise<void>;
```

- `material`: The file resources of the current micro-generator, with a value of `context.current!.material`.
- `findGlob`: The matching rule for template files, which supports the [glob](https://www.npmjs.com/package/glob) format. For example, `templates/**/*` matches all files in the templates directory.
- `target`: The target file name, which renames files that meet the criteria. The function takes the file name as its parameter.
- `options.parameters`: The values of template variables. When EJS variables exist in the template, define the corresponding variable values.
- `options.nodir`/`options.dot`/`options.ignore`: glob matching parameters.

Example:

```ts
const ejsAPI = new EjsAPI(generator);
await ejsAPI.renderTemplateDir(
  context.current!.material,
  'templates/**/*',
  (resourceKey: string) =>
    resourceKey.replace('templates/', '').replace('.ejs', ''),
  { parameters: { name: 'name' } },
);
```
