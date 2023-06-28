# Concepts

Micro-generators will export a function by default, and the function takes `context` and `generator` as parameters. During the execution of the micro-generator, they will be automatically injected into the micro-generator.

```ts
import { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  /**
   * Todo
   */
};
```

## Context

`context` provides context information during the execution of the micro-generator, and its type definition is as follows:

```ts
export interface GeneratorContext {
  materials: Record<string, FsMaterial>;
  current: RuntimeCurrent | null;
  config: Record<string, any>;
  [key: string]: any;
}
```

### materials

`materials` is the file abstraction system of CodeSmith. When the micro-generator runs, it can obtain the template files and target project files of the current micro-generator from here and operate on them.

The key of `materials` is the name and version of the micro-generator, such as `@modern-js/generator-generator@3.1.25`. When executing a local generator, it is `generator-demo@local`.

The value of `materials` is `FsMaterial`, and its type is:

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

The `get` and `find` methods provided by `FsMaterial` can be used to obtain the template files of the micro-generator. For example:

```ts
const material = context.materials['generator-demo@local'];
const content = (await material.get('package.json').value()).content;
```

`materials` also provides a special key - `default`, which is used to obtain file resources of the target project and operate on the target project files.

```ts
const content = (await context.materials.default.get('package.json').value())
  .content;
```

When only the root path of the target project is needed:

```ts
const appDir = context.materials.default.basePath;
```

### current

Used to store the file information of the micro-generator being executed, it can quickly obtain the relevant file paths of the current micro-generator, and its type is:

```ts
export interface RuntimeCurrent {
  material: FsMaterial;
}
```

The `package.json` file of `generator-demo` can be quickly obtained in the following way:

```ts
const { material } = this.generatorContext.current;
const content = (await material.get('package.json').value()).content;
```

### config

Used to store the `config` configuration when the micro-generator is executed. This configuration can be obtained through `context.config` during the execution of the micro-generator.

## Generator

`generator` provides some tools and methods during the execution of the micro-generator, and its type definition is as follows:

```ts
interface GeneratorCore {
  logger: ILogger;
  outputPath: string;
  runSubGenerator(subGenerator: string, relativePwdPath?: string, config?: Record<string, any>): Promise<void>;
}
```

### logger

`logger` provides functions for printing logs, supports multiple types such as `info`, `warn`, `error`, `debug`, etc., and its type definition is as follows:

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

When using `generator.logger.xx` to call the logger function, the corresponding type information will be automatically added in front of the submitted information, for example:

```ts
generator.logger.info('Success!');
```

It will be displayed as:

```bash
[INFO] Success!
```

By default, only `info`, `warn`, and `error` information will be displayed when CodeSmith is executed. Debug information will be displayed in debug mode. Using debug logs can be used for development debugging and error troubleshooting.

### outputPath

The output path of the micro-generator execution, which is the path of the target project, is the same as `context.materials.default.basePath`.

> `context.materials.default.basePath` is usually used to obtain file resources of the target project, and `generator.outputPath` is usually used to directly operate on target files.

### runSubGenerator

Method for running sub-micro-generators. This method supports calling other micro-generators in the current micro-generator. `subGenerator` needs to use the npm package name or absolute path of the corresponding micro-generator, and `relativePwdPath` is the target path (relative to the current micro-generator) where the sub-micro-generator will be executed.

For example:

```ts
await generator.runSubGenerator('@modern-js/generator-generator', 'apps', context.config);
```

OR

```ts
await generator.runSubGenerator('<path>/generator-generator', 'apps', context.config);
```

In addition to the `context` and `generator` parameters, CodeSmith also provides many APIs for completing generator development. For details, please refer to [API](./api/index.md).

> Adding dependencies in micro-generators needs to be placed in `devDependencies`. The corresponding build script will automatically package the dependencies.
