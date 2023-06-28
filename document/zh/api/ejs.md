# EJS API

[English](../../zh/api/ejs.md) | 简体中文

EJS API 是由 `@modern-js/codesmith-api-ejs` 包提供，该包提供了使用 [EJS](https://ejs.co/) 渲染单个文件及文件夹方法。

## 使用姿势

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

- 创建 EjsAPI 实例，参数为 generator。
- 调用实例上提供的 API 方法。

## API

### renderTemplate

渲染单个 EJS 模板文件。其类型定义为：

```ts
renderTemplate: (
  templateResource: FsResource,
  target: string,
  parameters?: Record<string, string>,
) => Promise<void>;
```

- `templateResource`：模板文件，通过 `context.current!.material.get(<filePath>)` 获取。
- `target`： 目标文件路径。
- `parameters`：模板变量值，当模板中存在 EJS 变量时，定义对应变量值。

### renderTemplateDir

批量渲染 EJS 模板文件夹。其类型定义为：

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
- `options.parameters`：模板变量值，当模板中存在 EJS 变量时，定义对应变量值。
- `options.nodir`/`options.dot`/`options.ignore`：glob 匹配参数。

示例：

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
