# App API

English | [简体中文](../../zh/api/app.md)

The App API is provided by the `@modern-js/codesmith-api-app` package and encapsulates commonly used APIs in the micro-generator development process, including batch file operations, git and NPM combination operations, etc.

> When meeting the requirements, it is recommended to use the App API.

## Usage

```ts
import { AppAPI } from '@modern-js/codesmith-api-app';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const appApi = new AppAPI(context, generator);
  await appApi.runInstall();
};
```

- Create an instance of AppAPI with the same parameters as the micro-generator.
- Call the API methods provided on the instance.

## API

### checkEnvironment

Check the operating environment of the current generator, which is defined as follows:

```ts
checkEnvironment(nodeVersion?: string): Promise<boolean>;
```

- `nodeVersion`: The minimum version of node that is supported and is set to `12.22.12` by default, and must comply with the semver specification.

### getInputBySchema

Complete user interaction through Schema and collect user information. It is defined as follows:

```ts
getInputBySchema(
  schema: FormilySchema | Question[],
  type?: 'formily' | 'inquirer',
  configValue?: Record<string, unknown>,
  validateMap?: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => {
      success: boolean;
      error?: string;
    }
  >,
  initValue?: Record<string, any>,
): Promise<Record<string, any>>;
```

- `schema`: A list of questions that supports [Formily Schema](./input.md) and [inquirer Question](https://www.npmjs.com/package/inquirer).
- `type`: The type of Schema, which is set to Formily Schema by default.
- `configValue`: The default value of the schema. If this value is passed in, the question corresponding to the schema field will no longer interact with the user.
- `validateMap`: Validation function for special fields in the schema.
- `initValue`: The initialization value of the field in the schema.

> After the interaction is completed, the Schema value will be automatically merged into the micro-generator config.

### getInputBySchemaFunc

Complete user interaction through Schema function and obtain user information. It is defined as follows:

```ts
getInputBySchemaFunc: (
  schemaFunc: (config?: Record<string, any>) => FormilySchema,
  configValue?: Record<string, unknown>,
  validateMap?: Record<
    string,
    (
      input: unknown,
      data?: Record<string, unknown>,
    ) => {
      success: boolean;
      error?: string;
    }
  >,
  initValue?: Record<string, any>,
) => Promise<Record<string, any>>;
```

- `schemaFunc`: A function that returns a list of questions, with the current micro-generator config value as its parameter, and [Formily Schema](./input.md) as its return value.

The other parameters are the same as those of `getInputBySchema`. This method can be used in scenarios where the Schema needs to be dynamically calculated based on the config.

### forgeTemplate

Batch render template files. It is defined as follows:

```ts
forgeTemplate: (
  templatePattern: string,
  filter?: (resourceKey: string) => boolean,
  rename?: (resourceKey: string) => string,
  parameters?: Record<string, any>,
  type?: 'handlebars' | 'ejs',
) => Promise<void>;
```

- `templatePattern`: The matching rule for template files, which supports the [glob](https://www.npmjs.com/package/glob) format. For example, `templates/**/*` matches all files in the templates directory.
- `filter`: A filter function that performs secondary filtering on files that meet the templatePattern. Returns true to add the file and false to ignore the file. The filter function takes the file name as its parameter.
- `rename`: A rename function that renames files that meet the criteria. The function takes the file name as its parameter and is set to `resourceKey.replace('templates/', '').replace('.handlebars', '').replace('.ejs', '')` by default.
- `parameters`: The values of template variables. When Handlebars or EJS variables exist in the template, define the corresponding variable values.
- `type`: The template type, which supports Handlebars or EJS and is set to Handlebars by default.

### renderTemplateByFileType

Batch render template files based on file type. It is defined as follows:

```ts
renderTemplateByFileType: (
  templatePattern: string,
  filter?: (resourceKey: string) => boolean,
  rename?: (resourceKey: string) => string,
  parameters?: Record<string, any>,
) => Promise<void>;
```

This function selects Handlebars or EJS for rendering based on whether the file name contains the keywords `.handlebars` and `.ejs`. If neither keyword is present, fs is used for copy operations.

The function parameters correspond to `forgeTemplate`.

### runGitAndInstall

Git initialization and dependency installation. It is defined as follows:

```ts
runGitAndInstall: (
  commitMessage?: string,
  installFunc?: () => Promise<void>,
) => Promise<void>;
```

- `commitMessage`: The commit message information, with a default value of `feat: init`.
- `installFunc`: A custom dependency installation function. By default, the corresponding install command is executed based on `config.PackageManager`.

### runInstall

Install dependencies. It is defined as follows:

```ts
runInstall: (
  command?: string,
  options?: {
    cwd?: string;
    registryUrl?: string;
    ignoreScripts?: boolean;
  },
) => Promise<void>;
```

- `command`: A custom dependency installation command. By default, the corresponding install command is executed based on `config.PackageManager`.
- `options.cwd`: The directory where the dependency is installed.
- `options.registryUrl`: The registry parameter for installing dependencies.
- `options.ignoreScripts`: Whether `--ignore-scripts` parameter is needed during dependency installation.

### runSubGenerator

Run a sub micro-generator. It is defined as follows:

```ts
runSubGenerator: (
  subGenerator: string,
  relativePwdPath?: string,
  config?: Record<string, unknown>,
) => Promise<void>;
```

- `subGenerator`: The npm package name or absolute path of the sub micro-generator.
- `relativePwdPath`: The execution target path of the sub micro-generator (relative to the target path of the current micro-generator).
- `config`: The initialization and running configuration of the sub micro-generator.

### showSuccessInfo

Show success information. It is defined as follows:

```ts
showSuccessInfo(successInfo?: string): void;
```

- `successInfo`: Success information, with a default value of `Success!`.

### i18n.changeLanguage

Specify the default language, which supports `zh` and `en`.

There are many prompt messages in the App API, which support both Chinese and English. Use this API to specify the language used.

It is defined as follows:

```ts
changeLanguage(config: { locale: 'zh' | 'en' }): void;
```

- `config.locale`: The default language, which supports `zh` and `en`, and is set to `en` by default.
