# 贡献指南

[English](./CONTRIBUTING.md) | 简体中文

感谢你有兴趣为 CodeSmith 做贡献！在开始你的贡献之前，请花几分钟时间阅读以下指南。

## 设置开发环境

### Fork 仓库

[Fork](https://help.github.com/articles/fork-a-repo/) CodeSmith 仓库到你的 GitHub 账户，然后 [clone](https://help.github.com/articles/cloning-a-repository/) 到你的本地。

### 安装 Node.js

我们推荐使用 Node.js 16 或 18。你可以通过以下命令查看当前使用的 Node.js 版本：

```bash
node -v
#v16.18.0
```

如果你当前环境没有安装 Node.js，可以使用 [nvm](https://github.com/nvm-sh/nvm)或者 [fnm](https://github.com/Schniz/fnm) 来安装它。

以下是如何通过 nvm 安装 Node.js 16 LTS 版本的示例：

```bash
# 安装 Node.js 16 的 LTS 版本
nvm install 16 --lts

# 将新安装的 Node.js 16 设为默认版本
nvm alias default 16

# 切换到新安装的 Node.js 16
nvm use 16
```

### 安装 pnpm

```bash
# 使用 corepack 启用 pnpm，仅在 Node.js >= `v14.19.0` 上可用
corepack enable
```

### 安装依赖

```sh
pnpm install
```

这将完成：

- 安装所有依赖项
- 在 monorepo 中的 packages 之间创建 symlinks
- 运行 `prepare` 脚本来构建所有包（这将需要一些时间，但可以保证所有包都被正确构建）

> 在此之后，你通常不需要一次性构建所有 packages。如果你正在开发的新功能依赖另一个 package 的最新代码，通常只构建指定的 package 就足够了。

### 设置 Git 邮箱

请确保在 `<https://github.com/settings/emails>` 中设置了电子邮件，当你提交 Pull Request 时将需要它。

检查你的 git 客户端是否已配置邮箱：

```sh
git config --list | grep email
```

全局设置邮箱：

```sh
git config --global user.email "SOME_EMAIL@example.com"
```

针对本地仓库设置邮箱：

```sh
git config user.email "SOME_EMAIL@example.com"
```

---

## 代码变更和构建

当你在 fork 的仓库中设置完本地开发环境后，我们就可以开始开发了。

### 创建一个新分支

建议在一个新的分支上开发，这样便于后续提交 pull request：

```sh
git checkout -b MY_BRANCH_NAME
```

### 构建 Package

要构建你要更改的 package，首先打开 package 目录，然后执行 `build` 命令：

```sh
# 将 some-path 替换为你要构建的 package 的路径
cd ./packages/some-package
pnpm run build
```

此外，你可以使用 `--filter` 选项从仓库根目录来构建指定的 package：

```sh
pnpm run --filter @modern-js/some-package build
```

构建所有包：

```sh
pnpm run prepare
```

如果你需要清理项目中的所有 `node_modules/*`，执行 `reset` 命令：

```sh
pnpm run reset
```

---

## 测试

### 添加新测试

如果你进行了 bugfix，或者添加了需要测试的代码，请添加一些测试代码。

你可以在 `<PACKAGE_DIR>/tests` 文件夹中添加单元测试用例。测试语法基于 [Jest](https://jestjs.io/) 和 [Vitest](https://vitest.dev/)。

### 运行单元测试

在提交 pull request 之前，为了确保本次变更没有引入缺陷，你可以通过执行以下命令运行单元测试：

```sh
pnpm run test
```

你也可以使用 `--filter` 选项运行单个包的单元测试：

```sh
pnpm run --filter @modern-js/some-package test
```

---

## Linting

为了帮助保持代码风格的一致性和可读性，我们使用 ESLint 对代码进行校验。

你可以执行以下命令来运行 Linter：

```sh
pnpm run lint
```

---

## 提交变更

### 添加 Changeset

CodeSmith 使用 [Changesets](https://github.com/changesets/changesets) 来管理版本和 Changelog。

如果你修改了一些包，则需要为本次变更添加一个新的变更集。请运行 `change` 命令来选择更改的包并添加 changeset 信息。

```sh
pnpm run change
```

### 提交你的变更

提交变更到 fork 后的仓库，并 [创建 pull request](https://help.github.com/articles/creating-a-pull-request/)。

### PR 标题格式

PR 标题的格式遵循 Conventional Commits。

一个例子：

```
feat(core): 添加 `xxx` 配置项
^ ^ ^
| | |__ 主题
| |_______ 范围
|____________ 类型
```

---

## 发布

CodeSmith 使用 [Changesets](https://github.com/changesets/changesets) 来管理版本和 changelog。

仓库的维护者可以将所有包的新版本发布到 npm。

以下是发布的步骤（我们通常使用 CI 进行发布，并避免在本地发布 npm 包）：

1. 拉取 `main` 分支的最新代码。
2. 安装依赖：

```sh
pnpm i
```

3. 构建 packages：

```sh
pnpm prepare
```

4. 升级版本：

```sh
pnpm run bump
```

5. 提交版本变更。

```sh
git add .
git commit -m "Release va.b.c"
```
