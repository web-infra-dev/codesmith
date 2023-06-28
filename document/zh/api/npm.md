# NPM API

[English](../../en/api/npm.md) | 简体中文

NPM API 是由 `@modern-js/codesmith-api-npm` 包提供，该包提供了不同的包管理工具安装依赖的方法。

## 使用姿势

```ts
import { NpmAPI } from '@modern-js/codesmith-api-npm';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const npmApi = new NpmAPI(generator);
  await npmApi.pnpmInstall({});
};
```

- 创建 NpmAPI 实例，参数和微生成器参数一致。
- 调用实例上提供的 API 方法。

## API

### npmInstall

使用 npm 安装依赖。其类型定义为：

```ts
npmInstall: ({
  cwd,
  registryUrl,
  ignoreScripts,
}: {
  cwd?: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
  useNvm?: boolean;
}) => Promise<void | ExecaReturnValue<string>>;
```

- `cwd`： install 命令的执行目录，默认为 `generator.outputPath`。
- `registryUrl`：安装依赖的 registry 参数。
- `ignoreScripts`：安装依赖时是否需要 `--ignore-scripts` 参数。
- `useNvm`：是否使用 nvm 切换 node 版本。

### yarnInstall

使用 yarn 安装依赖。其类型定义为：

```ts
yarnInstall: ({
  cwd,
  registryUrl,
  ignoreScripts,
}: {
  cwd?: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
  useNvm?: boolean;
}) => Promise<void | ExecaReturnValue<string>>;
```

参数和 `npmInstall` 参数一致。

### pnpmInstall

使用 pnpm 安装依赖。其类型定义为：

```ts
pnpmInstall: ({
  cwd,
  registryUrl,
  ignoreScripts,
}: {
  cwd?: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
  useNvm?: boolean;
}) => Promise<void | ExecaReturnValue<string>>;
```

参数和 `npmInstall` 参数一致。
