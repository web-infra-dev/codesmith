# JSON API

[English](../../zh/api/json.md) | 简体中文

JSON API 是由 `@modern-js/codesmith-api-json` 包提供，该包提供了获取 JSON 文件内容，更新 JSON 文件等方法。

## 使用姿势

```ts
import { JsonAPI } from '@modern-js/codesmith-api-json';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const jsonAPI = new JsonAPI(generator);
  await jsonAPI.update(context.materials.default.get('package.json'), {
    query: {},
    update: {
      $set: {
        'dependencies.@edenx/plugin-bff': `^2.0.0`,
      },
    },
  });
};
```

- 创建 JsonAPI 实例，参数为 generator。
- 调用实例上提供的 API 方法。

## API

### get

获取 JSON 文件内容。其类型定义为：

```ts
get: (resource: FsResource) => Promise<Record<string, any>>;
```

- `resource`： `context.materials.default.get(<filePath>)` 获取。

### extend

合并对象至 JSON 文件。其类型定义为：

```ts
extend(resource: FsResource, obj: Record<string, any>): Promise<void>;
```

- `resource`： `context.materials.default.get(<filePath>)` 获取。
- `obj`：合并对象

### update

更新对象字段至 JSON 文件。其类型定义为：

```ts
update(resource: FsResource, operation: {
    query: Record<string, any>;
    update: Record<string, any>;
  }): Promise<void>;
```

- `resource`： `context.materials.default.get(<filePath>)` 获取。
- `operation`：更新操作，详细使用姿势可查看 [declaration-update](https://www.npmjs.com/package/declaration-update)。
