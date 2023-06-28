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

English | [简体中文](./README.zh-CN.md)

## Introduce

CodeSmith is a code generation tool that uses the concept of micro-generators to complete the entire code generation process.

Traditional scaffolding usually provides project-level generators based on templates, which are used once and then discarded. After generating the project, they do not help with subsequent business iterations.

Micro-generators focus on the entire lifecycle of the project. They can generate file modules of various granularities and types in the project (such as entry, component, model, etc.), and can also generate abstract business logic (which may not create new files, but automatically refactor existing files). Micro-generators are not one-time tools used only when creating projects, but a toolbox that accompanies the project's subsequent iterative process.

[`@modern-js/create`](https://www.npmjs.com/package/@modern-js/create) is based on CodeSmith and dynamically generates different initial files and codes or modifies and restructures existing files and codes based on different micro-generators loaded on demand during the Q&A process.

The new command provided by Modern.js is also based on CodeSmith and is used to create project elements and enable functions during the project development process.

## Document

- [Quick Start](./document/en/start.md)
- [Concepts](./document/en/concept.md)
- [API](./document/en/api/index.md)

## Contributing

> New contributors welcome!

Please read the [Contributing Guide](https://github.com/web-infra-dev/codesmith/blob/main/CONTRIBUTING.md).

### Code of Conduct

This repo has adopted the Bytedance Open Source Code of Conduct. Please check [Code of Conduct](./CODE_OF_CONDUCT.md) for more details.

## License

Modern.js is [MIT licensed](https://github.com/web-infra-dev/codesmith/blob/main/LICENSE).
