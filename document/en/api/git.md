# Git API

English | [简体中文](../../zh/api/git.md)

The Git API is provided by the `@modern-js/codesmith-api-git` package, which provides methods for initializing Git repositories, committing Git commits, etc.

## Usage

```ts
import { GitAPI } from '@modern-js/codesmith-api-git';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const gitApi = new GitAPI(generatorCore, generatorContext);
  await gitApi.initGitRepo();
};
```

- Create an instance of GitAPI with the same parameters as the micro-generator.
- Call the API methods provided on the instance.

## API

### isInGitRepo

Determine if the current project is a git repository. It is defined as follows:

```ts
isInGitRepo: (cwd?: string) => Promise<boolean>;
```

- `cwd`: The project directory, with a default value of `generator.outputPath`.

### initGitRepo

Initialize the current project as a git repository. It is defined as follows:

```ts
initGitRepo(cwd?: string, force?: boolean): Promise<void>;
```

- `cwd`: The project directory, with a default value of `generator.outputPath`.
- `force`: Whether to force initialization if the current directory is already a git repository.

### addAndCommit

Commit current changes. It is defined as follows:

```ts
addAndCommit(commitMessage: string, cwd?: string): Promise<void>;
```

- `commitMessage`: The commit message.
- `cwd`: The project directory, with a default value of `generator.outputPath`.
