# FS API

[English](../../en/api/fs.md) | 简体中文

FS API 是由 `@modern-js/codesmith-api-fs` 包提供，该包提供了渲染单个文件及文件夹方法。

## 使用姿势

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

- 创建 FsAPI 实例，参数为 generator。
- 调用实例上提供的 API 方法。

## API

### renderFile

渲染单个文件。其类型定义为：

```ts
renderFile: (resource: FsResource, target: string) => Promise<void>;
```

- `resource`： `context.current!.material.get(<filePath>)` 获取。
- `target`: 目标文件路径。

### renderDir

批量渲染文件夹。其类型定义为：

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

- `material`：当前微生成器文件资源，其值为 `context.current!.material`。
- `findGlob`：模板文件匹配规则，支持 [glob](https://www.npmjs.com/package/glob) 格式，例如：`templates/**/*` 为 templates 目录所有文件。
- `target`：目标文件名称，对满足条件的文件进行重命名，函数参数为文件名称。
- `options.nodir`/`options.dot`/`options.ignore`：glob 匹配参数。

示例：

```ts
const fsAPI = new FsAPI(generator);
await fsAPI.renderDir(
  context.current!.material,
  'templates/**/*',
  (resourceKey: string) =>
    resourceKey.replace('templates/', ''),
);
```
