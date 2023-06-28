# 核心概念

微生成器默认会导出一个函数，函数的参数为 `context` 和 `generator`，在微生成器执行过程中，它们会自动注入到微生成器中。

```ts
import { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  /**
   * Todo
   */
};
```

## Context

context 上提供了微生成器运行过程中的上下文信息，其类型定义为：

```ts
export interface GeneratorContext {
  materials: Record<string, FsMaterial>;
  current: RuntimeCurrent | null;
  config: Record<string, any>;
  [key: string]: any;
}
```

### materials

`materials` 是 CodeSmith 的文件抽象系统，当微生成器运行时，从这里可以获取到当前执行的微生成器的模板文件及目标项目文件，并对它们进行操作。

`materials` 的 key 为微生成器的名称及版本，比如 `@modern-js/generator-generator@3.1.25`，当执行本地生成器时，为 `generator-demo@local`。

`materials` 的 value 为 `FsMaterial`，其类型为：

```ts
interface FsResource {
  filePath: string;
  resourceKey: string;
  value(): Promise<{
    content: string | Buffer;
  }>;
}

interface FsMaterial {
  basePath: string;
  get(resourceKey: string): FsResource;
  find(
    globStr: string,
    options?: {
      nodir?: boolean;
      dot?: boolean;
      ignore?: string | readonly string[];
    },
  ): Promise<Record<string, FsResource>>;
}
```

通过 `FsMaterial` 提供的 `get` 和 `find` 方法可以获取微生成器的模板文件。例如：

```ts
const material = context.materials['generator-demo@local'];
const content = (await material.get('package.json').value()).content;
```

`materials` 上还提供了一个特殊的 key -- default，用于获取目标项目的文件资源，用于对目标项目进行文件操作。

```ts
const content = (await context.materials.default.get('package.json').value())
  .content;
```

当只需要目标项目根路径时：

```ts
const appDir = context.materials.default.basePath;
```

### current

用于存放当前正在执行的微生成器的文件信息，可以快速的获取到当前微生成器相关文件路径，其类型为：

```ts
export interface RuntimeCurrent {
  material: FsMaterial;
}
```

上述获取 `generator-demo` 的 `package.json` 文件，可以通过下面方式快速获取：

```ts
const { material } = this.generatorContext.current;
const content = (await material.get('package.json').value()).content;
```

### config

用于存放微生成器执行时的 config 配置，该配置在微生成器执行过程中可以通过 context.config 获取到。

## Generator

`generator` 提供了微生成器运行时一些工具和方法，其类型定义为：

```ts
interface GeneratorCore {
  logger: ILogger;
  outputPath: string;
  runSubGenerator(subGenerator: string, relativePwdPath?: string, config?: Record<string, any>): Promise<void>;
}
```

### logger

logger 上提供了打印日志的函数，支持 `info`、`warn`、`error`、`debug` 等多种类型。其类型定义为：

```ts
export declare enum LoggerLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
}

type LeveledLogMethod = (...meta: any[]) => void;

export interface ILogger {
  level: LoggerLevel;
  [LoggerLevel.Error]: LeveledLogMethod;
  [LoggerLevel.Warn]: LeveledLogMethod;
  [LoggerLevel.Info]: LeveledLogMethod;
  [LoggerLevel.Debug]: LeveledLogMethod;
}
```

当使用 `generator.logger.xx` 调用 loggger 函数时，会自动在提交的信息前面加上对应的类型信息，例如：

```ts
generator.logger.info('创建成功');
```

对应执行后会展示为：

```bash
[INFO] 创建成功
```

默认情况下，CodeSmith 执行时只会展示 `info`、`warn`、`error` 信息，在 debug 模式下会展示 debug 信息，使用 debug 日志可以用于开发调试及错误排查。

### outputPath

微生成器执行的输出路径，也就是目标项目的路径，和 `context.materials.default.basePath` 指向同一个路径。

> `context.materials.default.basePath` 通常用于获取目标项目的文件资源，`generator.outputPath` 通常用于直接操作目标文件。

### runSubGenerator

运行子微生成器方法。该方法支持在当前微生成器中调用其他微生成器，`subGenerator` 需要使用对应微生成器的 npm 包名或者绝对路径，`relativePwdPath` 为子微生成器执行的目标路径(相对于当前微生成器)。

例如：

```ts
await generator.runSubGenerator('@modern-js/generator-generator', 'apps', context.config);
```

或者

```ts
await generator.runSubGenerator('<path>/generator-generator', 'apps', context.config);
```

除了 `context` 和 `generator` 参数，CodeSmith 还提供了很多 API 用于完成生成器开发，详细可查看 [API](./api/index.md)。

> 微生成器中添加依赖需要放到 `devDependencies` 中，对应构建脚本会自动对依赖进行打包处理。
