<p align="center">
  <a href="https://modernjs.dev" target="blank"><img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ylaelkeh7nuhfnuhf/modernjs-cover.png" width="260" alt="Modern.js Logo" /></a>
</p>

<h1 align="center">CodeSmith</h1>

<p align="center">
  A cool code generation tool.
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@modern-js/codesmith?style=flat-square&color=00a8f0" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/@modern-js/codesmith.svg?style=flat-square&color=00a8f0" alt="downloads" />
  <img src="https://img.shields.io/npm/l/@modern-js/codesmith?style=flat-square&color=00a8f0" alt="License" />
</p>

[English](./README.md) | 简体中文

## 介绍

CodeSmith 是一个代码生成工具，使用微生成器的理念来完成整个代码生成过程。

传统脚手架通常提供整个项目级别的生成器，基于模板，一用即抛，生成完项目之后，对后续的业务迭代没有帮助。

微生成器关注的是项目的整个生命周期，既可以生成项目中各种粒度各种类型的文件模块（比如 entry、component、model 等），也可以生成抽象的业务逻辑（可能不创建新文件，而是在现有文件上做自动重构）。微生成器不是只在最初创建项目的时候使用的一次性工具，而是伴随项目后续迭代过程的工具箱。

[`@modern-js/create`](https://www.npmjs.com/package/@modern-js/create) 是基于 CodeSmith 实现的，会在问答过程中，按需加载不同的微生成器，动态生成不同的初始文件和代码或修改重组已有的文件和代码。

Modern.js 提供的 `new` 命令也是基于 CodeSmith 实现的，用于项目开发过程中新建项目元素、开启功能等。

## 快速上手

请阅读 [快速上手](./document/zh/start.md) 创建一个 CodeSmith 项目。

## 参与贡献

> 欢迎参与 CodeSmith 贡献！

请阅读 [贡献指南](https://github.com/web-infra-dev/codesmith/blob/main/CONTRIBUTING.zh-CN.md) 来共同参与 CodeSmith 的建设。

### 行为准则

本仓库采纳了字节跳动的开源项目行为准则。请点击 [行为准则](./CODE_OF_CONDUCT.md) 查看更多的信息。

## License

CodeSmith 项目基于 [MIT 协议](https://github.com/web-infra-dev/codesmith/blob/main/LICENSE)，请自由地享受和参与开源。
