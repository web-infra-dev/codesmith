# 快速上手

## 创建项目

```bash
mkdir generator-demo && cd generator demo
npx @modern-js/codesmith-cli@latest @modern-js/generator-generator
? 请填写项目名称 generator-demo
? 请选择包管理工具 pnpm
? 请选择开发语言 TS
```

## 目录结构

创建完成后的项目目录结构

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

项目是基于 [Modern.js 模块项目](https://modernjs.dev/module-tools) 创建的，核心是下面几个文件：

```bash
.
├── src
│   └── index.ts
├── templates
│   └── .gitkeep
```

### src/index.ts

该文件用于完成微生成器的内容开发。

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

该文件默认导出一个函数，函数参数为 `context` 和 `generator`。`context` 上提供了微生成器运行的一些上下文信息，`generator` 上提供了一些生成器运行的工具和方法。

### templates

`templates` 目录存在当前微生成器的模板文件，支持 Handlebars 和 EJS 格式，微生成器提供了对应操作不同类型文件的 API。

如果模板文件为 `js`、`ts` 或者 `json` 文件，推荐直接使用 `.handlebars` 或者 `.ejs` 后缀，可避免项目 eslint 报错和在 Monorepo 中项目识别问题。

模板中 `.gitignore` 文件和 `.npmrc` 文件在发布 npm 包时会自动删除，需要使用 `.handlebars` 或者 `.ejs` 后缀将其保留。

## 使用

### 命令行运行

CodeSmith 提供了 CLI 工具用于直接运行微生成器，支持两种格式：

- 绝对路径

适用于本地开发调试，开发完成后，在微生成器执行 npm run build 构建项目，然后使用下面命令即可进行测试。

```bash
npx @modern-js/codesmith-cli@latest <generatorPath>
```

- npm 包

适用于微生成器发布于 bnpm 上，共享微生成器场景。

```bash
npx @modern-js/codesmith-cli@latest <generatorPackage>
```

### 使用 JS 执行

除了使用 CLI 的方式执行微生成器，CodeSmith 还支持在代码中执行微生成器。

- 安装 CodeSmith 依赖

```bash
pnpm add @modern-js/codesmith
```

- 创建 CodeSmith 实例

```ts
import { CodeSmith } from '@modern-js/codesmith';

const smith = new CodeSmith({
  debug: false,
});
```

> debug 为 true 时将开发 Debug 模式，会打印对应的 debug 日志。

- 调用 forge 方法运行微生成器

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
