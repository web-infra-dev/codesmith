# Quick Start

English | [简体中文](../zh/start.md)

## Create Project

```bash
mkdir generator-demo && cd generator demo
npx @modern-js/codesmith-cli@latest @modern-js/generator-generator
? Please fill in the project name: generator-demo
? Please select the package manager: pnpm
? Please select the programming language: TS
```

## Project Structure

After creating, we can take a look at the directory structure of this project:

```bash
.
├── .changeset
│   └── config.json
├── .eslintrc.js
├── .gitignore
├── .husky
│   └── pre-commit
├── .npmrc
├── .nvmrc
├── .prettierrc
├── .vscode
│   ├── extensions.json
│   └── settings.json
├── README.md
├── modern.config.ts
├── package.json
├── src
│   ├── .eslintrc.js
│   ├── index.ts
│   └── modern-app-env.d.ts
├── templates
└── tsconfig.json
```

The project is based on the [Modern.js Module](https://modernjs.dev/module-tools/en) project, and the core files are as follows:

```bash
.
├── src
│   └── index.ts
├── templates
│   └── .gitkeep
```

## src/index.ts

This file is used to complete the content development of the micro generator.

```ts
import { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';
import { AppAPI } from '@modern-js/codesmith-api-app';

const handleTemplateFile = async (appApi: AppAPI) => {
  await appApi.forgeTemplate('templates/**/*');
};

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const appApi = new AppAPI(context, generator);

  const { locale } = context.config;
  appApi.i18n.changeLanguage({ locale });

  if (!(await appApi.checkEnvironment())) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  generator.logger.debug(`start run @modern-js/generator-demo`);
  generator.logger.debug(`context=${JSON.stringify(context)}`);
  generator.logger.debug(`context.data=${JSON.stringify(context.data)}`);

  await handleTemplateFile(appApi);

  await appApi.runInstall();

  appApi.showSuccessInfo();

  generator.logger.debug(`forge @modern-js/generator-demo succeed `);
};
```

This file exports a function by default, and the function takes `context` and `generator` as parameters. The `context` object provides some context information during the execution of the micro-generator, and the `generator` object provides some tools and methods for the execution of the generator.

## templates

The `templates` directory contains template files for the current customization method, supporting [Handlebars](https://handlebarsjs.com/) and [EJS](https://ejs.co/) formats. Different rendering engines will be used for rendering according to the template file suffix. If there is no suffix, the template file will be copied directly to the target directory.

If the template file is a `js`, `ts`, or `json` file, it is recommended to use the `.handlebars` or `.ejs` suffix directly to avoid project eslint errors and recognition issues in Monorepo projects.

The `.gitignore` and `.npmrc` files in the template will be automatically deleted when publishing the npm package, so it is necessary to use the `.handlebars` or `.ejs` suffix to keep them.

## Usage

### Using with command line

CodeSmith provides a CLI tool for running micro-generators directly.

`@modern-js/codesmith-cli` supports two formats:

- Absolute path

Suitable for local development and debugging. After development is completed, build the project by executing `npm run build` in the micro-generator, and then use the following command for testing.

```bash
npx @modern-js/codesmith-cli@latest <generatorPath>
```

- Npm package

Suitable for micro-generators published on `bnpm` to share micro-generator scenarios.

```bash
npx @modern-js/codesmith-cli@latest <generatorPackage>
```

### Using with JS

In addition to using the CLI to execute micro-generators, CodeSmith also supports executing micro-generators in code.

- Install CodeSmith dependencies

```bash
pnpm add @modern-js/codesmith
```

- Create a CodeSmith instance

```ts
import { CodeSmith } from '@modern-js/codesmith';

const smith = new CodeSmith({
  debug: false,
});
```

> When `debug` is `true`, it will enable debug mode for development and print corresponding debug logs.

- Call the `forge` method to run the micro-generator

```ts
const smith = new CodeSmith({
  debug: false,
});

await smith.forge({
  tasks: [
    {
      generator: <generatorPath>,
      config: {},
    },
  ],
  pwd: '.',
});
```
