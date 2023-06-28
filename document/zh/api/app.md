# App API

App API 由 `@modern-js/codesmith-api-app` 包提供，是对微生成器开发过程中常用的 API 进行的封装，包括批量文件操作，git 和 NPM 组合操作等。

> 在满足需求时，推荐使用 App API。

## 使用姿势

```ts
import { AppAPI } from '@modern-js/codesmith-api-app';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const appApi = new AppAPI(context, generator);
  await appApi.runInstall();
};
```

- 创建 AppAPI 实例，参数和微生成器参数一致。
- 调用实例上提供的 API 方法。

## API

### checkEnvironment

检查当前生成器的运行环境，其类型定义为：

```ts
checkEnvironment(nodeVersion?: string): Promise<boolean>;
```

- `nodeVersion`：支持的 node 最小版本，默认为 `12.22.12`，需要满足 semver 规范。

### getInputBySchema

通过 Schema 完成用户交互，获取用户信息。其类型定义为：

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

- `schema`：问题列表，支持 [Formily Schema](/guide/custom/input.html) 和 [inquirer Question](https://www.npmjs.com/package/inquirer)。
- `type`：Schema 类型，默认为 Formily Schema。
- `configValue`：schema 默认值，传入该值的 schema 字段对应的问题将不再和用户交互。
- `validateMap`： schema 中特殊字段的验证函数。
- `initValue`：schema 中字段的初始化值。

> Schema 值在完成交互后会自动合并入微生成器 config 中。

### getInputBySchemaFunc

通过 Schema 函数完成用户交互，获取用户信息。其类型定义为：

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

- `schemaFunc`：问题列表函数，函数参数为当前微生成器的 config 值, 函数返回值为 [Formily Schema](/guide/custom/input.html)。

其余参数和 `getInputBySchema` 参数一致，该方法可用于需要根据 config 动态计算 Schema 的场景。

### forgeTemplate

批量渲染模板文件。其类型定义为：

```ts
forgeTemplate: (
  templatePattern: string,
  filter?: (resourceKey: string) => boolean,
  rename?: (resourceKey: string) => string,
  parameters?: Record<string, any>,
  type?: 'handlebars' | 'ejs',
) => Promise<void>;
```

- `templatePattern`：模板文件匹配规则，支持 [glob](https://www.npmjs.com/package/glob) 格式，例如：`templates/**/*` 为 templates 目录所有文件。
- `filter`：过滤函数，在满足 templatePattern 的文件中进行二次过滤，返回 true 代表需要添加该文件，返回 false 代表忽略该文件，过滤函数参数为文件名称。
- `rename`：重命名函数，对满足条件的文件进行重命名，函数参数为文件名称，默认为 `resourceKey.replace('templates/', '').replace('.handlebars', '').replace('.ejs', '')`。
- `parameters`：模板变量值，当模板中存在 Handlebars 或者 EJS 变量时，定义对应变量值。
- `type`：模板类型，支持 Handlebars 或者 EJS，默认为 Handlebars。

### renderTemplateByFileType

批量根据文件类型渲染模板文件。其类型定义为：

```ts
renderTemplateByFileType: (
  templatePattern: string,
  filter?: (resourceKey: string) => boolean,
  rename?: (resourceKey: string) => string,
  parameters?: Record<string, any>,
) => Promise<void>;
```

该函数将根据文件名称中是包含 `.handlebars` 和 `.ejs` 关键字选择 Handlebars 或者 EJS 进行渲染，如果都不包含，将直接使用 fs 进行 copy 操作。

函数参数对应和 `forgeTemplate` 一致。

### runGitAndInstall

Git 初始化及安装依赖。其类型定义为：

```ts
runGitAndInstall: (
  commitMessage?: string,
  installFunc?: () => Promise<void>,
) => Promise<void>;
```

- `commitMessage`：commit message 信息，默认值为 `feat: init`。
- `installFunc`：自定义安装依赖函数，默认会根据 `config.PackageManager` 执行对应的 install 命令。

### runInstall

安装依赖。其类型定义为：

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

- `command`：自定义安装依赖命令，默认会根据 `config.PackageManager` 执行对应的 install 命令。
- `options.cwd`：执行安装依赖目录。
- `options.registryUrl`：安装依赖的 registry 参数。
- `options.ignoreScripts`：安装依赖时是否需要 `--ignore-scripts` 参数。

### runSubGenerator

运行子微生成器。其类型定义为：

```ts
runSubGenerator: (
  subGenerator: string,
  relativePwdPath?: string,
  config?: Record<string, unknown>,
) => Promise<void>;
```

- `subGenerator`：子微生成器的 npm 包名称或者绝对路径。
- `relativePwdPath`：子微生成器的执行目标路径（相对于当前微生成器的目标路径）
- `config`：子微生成器的初始化运行配置。

### showSuccessInfo

展示成功信息。其类型定义为：

```ts
showSuccessInfo(successInfo?: string): void;
```

- `successInfo`：成功信息，默认值为 `成功！`。

### i18n.changeLanguage

指定默认语言，支持 `zh` 和 `en`。

App API 中有很多提示信息，支持中英双语，通过该 API 来指定其使用的语言。

其类型定义为：

```ts
changeLanguage(config: { locale: 'zh' | 'en' }): void;
```

- `config.locale`：默认语言，支持 `zh` 和 `en`，默认为 `en`。
