# NPM API

English | [简体中文](../../zh/api/npm.md)

The NPM API is provided by the `@modern-js/codesmith-api-npm` package, which provides methods for installing dependencies using different package managers.

## Usage

```ts
import { NpmAPI } from '@modern-js/codesmith-api-npm';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const npmApi = new NpmAPI(generator);
  await npmApi.pnpmInstall({});
};
```

- Create an instance of NpmAPI with the same parameters as the micro-generator.
- Call the API methods provided on the instance.

## API

### npmInstall

Install dependencies using npm. It is defined as follows:

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

- `cwd`: The directory where the install command is executed, with a default value of `generator.outputPath`.
- `registryUrl`: The registry parameter for installing dependencies.
- `ignoreScripts`: Whether `--ignore-scripts` parameter is needed during dependency installation.
- `useNvm`: Whether to use nvm to switch node versions.

### yarnInstall

Install dependencies using yarn. It is defined as follows:

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

The parameters are the same as those of `npmInstall`.

### pnpmInstall

Install dependencies using pnpm. It is defined as follows:

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

The parameters are the same as those of `npmInstall`.
