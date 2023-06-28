# Handlebars API

[English](../../en/api/handlebars.md) | 简体中文

Handlebars API 是由 `@modern-js/codesmith-api-handlebars` 包提供，该包提供了使用 [Handlebars](https://handlebarsjs.com/) 渲染单个文件及文件夹方法。

## 使用姿势

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

- 创建 HandlebarsAPI 实例，参数为 generator。
- 调用实例上提供的 API 方法。

## API

### registerHelp

注册 Handlebars 助手代码。其类型定义为：

```ts
registerHelp: (
  helpers: Record<string, handlebars.HelperDelegate>,
) => Promise<void>;
```

- `helpers`：块助手代码对象，块助手代码的使用可参考[这里](https://handlebarsjs.com/zh/guide/#%E5%9D%97%E5%8A%A9%E6%89%8B%E4%BB%A3%E7%A0%81)。

### registerPartials

注册 Handlebars 代码片段。其类型定义为：

```ts
registerPartials: (
  partials: Record<string, handlebars.Template>,
) => Promise<void>;
```

- `partials`：代码片段对象，代码片段的使用可参考[这里](https://handlebarsjs.com/zh/guide/#%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5)。

### renderTemplate

渲染单个 Handlebars 模板文件。其类型定义为：

```ts
renderTemplate: (
  templateResource: FsResource,
  target: string,
  parameters?: Record<string, string>,
) => Promise<void>;
```

- `templateResource`：模板文件，通过 `context.current!.material.get(<filePath>)` 获取。
- `target`： 目标文件路径。
- `parameters`：模板变量值，当模板中存在 Handlebars 变量时，定义对应变量值。

### renderTemplateDir

批量渲染 Handlebars 模板文件夹。其类型定义为：

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

- `material`：当前微生成器文件资源，其值为 `context.current!.material`。
- `findGlob`：模板文件匹配规则，支持 [glob](https://www.npmjs.com/package/glob) 格式，例如：`templates/**/*` 为 templates 目录所有文件。
- `target`：目标文件名称，对满足条件的文件进行重命名，函数参数为文件名称。
- `options.parameters`：模板变量值，当模板中存在 Handebars 变量时，定义对应变量值。
- `options.nodir`/`options.dot`/`options.ignore`：glob 匹配参数。

示例：

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
