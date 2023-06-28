# Handlebars API

English | [简体中文](../../zh/api/handelbars.md)

The Handlebars API is provided by the `@modern-js/codesmith-api-handlebars` package, which provides methods for rendering single files and folders using [Handlebars](https://handlebarsjs.com/).

## Usages

```ts
import { HandlebarsAPI } from '@modern-js/codesmith-api-handlebars';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const handlebarsAPI = new HandlebarsAPI(generator);
  await handlebarsAPI.renderTemplate(
    context.current!.material.get('templates/a.js.handlebars'),
    'b.js',
    { name: 'test handebars' },
  );
};
```

- Create an instance of HandlebarsAPI with the generator as the parameter.
- Call the API methods provided on the instance.

## API

### registerHelp

Register Handlebars helper code. It is defined as follows:

```ts
registerHelp: (
  helpers: Record<string, handlebars.HelperDelegate>,
) => Promise<void>;
```

- `helpers`: Block helper code object. The use of block helper code can be found [here](https://handlebarsjs.com/guide/#block-helpers).

### registerPartials

Register Handlebars code snippets. It is defined as follows:

```ts
registerPartials: (
  partials: Record<string, handlebars.Template>,
) => Promise<void>;
```

- `partials`: Code snippet object. The use of code snippets can be found [here](https://handlebarsjs.com/guide/#code-snippets).

### renderTemplate

Render a single Handlebars template file. It is defined as follows:

```ts
renderTemplate: (
  templateResource: FsResource,
  target: string,
  parameters?: Record<string, string>,
) => Promise<void>;
```

- `templateResource`: The template file, obtained through `context.current!.material.get(<filePath>)`.
- `target`: The target file path.
- `parameters`: The values of template variables. When Handlebars variables exist in the template, define the corresponding variable values.

### renderTemplateDir

Batch render Handlebars template folders. It is defined as follows:

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
- `options.parameters`: The values of template variables. When Handlebars variables exist in the template, define the corresponding variable values.
- `options.nodir`/`options.dot`/`options.ignore`: glob matching parameters.

Example:

```ts
const handlebarsAPI = new HandlebarsAPI(generator);
await handlebarsAPI.renderTemplateDir(
  context.current!.material,
  'templates/**/*',
  (resourceKey: string) =>
    resourceKey.replace('templates/', '').replace('.handlebars', ''),
  { parameters: { name: 'name' } },
);
```
