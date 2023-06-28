# Git API

[English](../../en/api/git.md) | 简体中文

Git API 由 `@modern-js/codesmith-api-git` 包提供，该包提供了初始化 Git 仓库，提交 Git commit 等方法。

## 使用姿势

```ts
import { GitAPI } from '@modern-js/codesmith-api-git';

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const gitApi = new GitAPI(generatorCore, generatorContext);
  await gitApi.initGitRepo();
};
```

- 创建 GitAPI 实例，参数和微生成器参数一致。
- 调用实例上提供的 API 方法。

## API

### isInGitRepo

判断当前项目是否为 Git 仓库。其类型定义为：

```ts
isInGitRepo: (cwd?: string) => Promise<boolean>;
```

- `cwd`：项目目录，默认为 `generator.outputPath`。

### initGitRepo

初始化当前项目为 Git 仓库。其类型定义为：

```ts
initGitRepo(cwd?: string, force?: boolean): Promise<void>;
```

- `cwd`：项目目录，默认为 `generator.outputPath`。
- `force`：如果当前目录已经为一个 Git 仓库，是否强制初始化。

### addAndCommit

提交当前变更。其类型定义为：

```ts
addAndCommit(commitMessage: string, cwd?: string): Promise<void>;
```

- `commitMessage`：commit 信息。
- `cwd`：项目目录，默认为 `generator.outputPath`。
