# @modern-js/codesmith

## 2.6.4

### Patch Changes

- ac3ad45: feat: op global package cache

  feat: 优化 global 包缓存逻辑，在版本不变时，缓存一直有效

  - @modern-js/codesmith-utils@2.6.4

## 2.6.3

### Patch Changes

- cd01abb: fix: remove custom registry end /

  fix: 移除自定义 registry 结尾 /

  - @modern-js/codesmith-utils@2.6.3

## 2.6.2

### Patch Changes

- 523d7ec: fix: get npm version registry not work && add get npm info cache

  fix: 修复获取 npm 版本 registry 不生效 && 新增获取 npm 信息缓存

  - @modern-js/codesmith-utils@2.6.2

## 2.6.1

### Patch Changes

- 1c3a0fd: feat: use request to get npm package tarball

  feat: 通过请求获取 npm 包 tarball 地址

  - @modern-js/codesmith-utils@2.6.1

## 2.6.0

### Minor Changes

- 1973e40: feat: optimize generator download

  feat: 优化生成器下载

### Patch Changes

- @modern-js/codesmith-utils@2.6.0

## 2.5.2

## 2.5.1

### Patch Changes

- 71d0268: feat: download package add detail time log

  feat: 下载 npm 包添加详细耗时日志

## 2.5.0

### Minor Changes

- 6d271ef: feat: refactor codesmith logger

  feat: 重构 codesmith 日志模块

### Patch Changes

- 28464e2: fix: install generator log not work

  fix: 安装生成器日志不生效

## 2.4.2

## 2.4.1

### Patch Changes

- 798f3d9: feat: npm publish ignore src file

## 2.4.0

## 2.3.6

### Patch Changes

- 1be9cbf: feat: add logger for install
  feat: install 添加 logger

## 2.3.5

### Patch Changes

- bbe6434: feat: remove npm option --prefer-offline
  feat: 移除 npm --prefer-offline 参数

## 2.3.4

## 2.3.3

### Patch Changes

- f8c1b50: fix: upgrade axios, CVE-2023-45857
  fix: 升级 axios 版本, CVE-2023-45857

## 2.3.2

### Patch Changes

- 58bd33e: fix: change timing to optional
  fix: timing 改为可选

## 2.3.1

### Patch Changes

- deb4a62: feat: add timing logger
  feat: 增加时间日志

## 2.3.0

### Minor Changes

- 562a50f: feat: upgrade modern version && update module output path

## 2.2.8

## 2.2.7

### Patch Changes

- 4844d9d: feat: downloadAndDecompressTargz function support electron env

  feat: downloadAndDecompressTargz 函数支持 electron 环境

## 2.2.6

### Patch Changes

- de1d271: feat: bump modern dependencies version

  fea: 升级 modern 依赖版本

- eb5ec83: chore: publishConfig add provenance config

  chore: publishConfig 增加 provenance 配置

## 2.2.5

### Patch Changes

- cde9b37: feat: run generator support relative path
- cde9b37: feat: when specifying a version number, ignore get the version number while downloading the generator package.

## 2.2.4

## 2.2.3

## 2.2.2

## 2.2.1

## 2.2.0

### Minor Changes

- f7d3176: chore: bump modern version && fix @modern-js/utils version

## 2.1.1

## 2.1.0

### Minor Changes

- 1452195: feat: upgrade modern version to v2

### Patch Changes

- 71a1e37: feat: show load generator error info

## 2.0.5

## 2.0.4

### Patch Changes

- e95bf71: feat: remove validate tar package length

## 2.0.3

## 2.0.2

## 2.0.1

### Patch Changes

- 18d3864: feat: change load generator loading text and color

## 2.0.0

### Major Changes

- 7fef6ae: feat: adjust codesmith peerDependencies

## 1.6.3

## 1.6.2

## 1.6.1

## 1.6.0

## 1.5.1

## 1.5.0

### Patch Changes

- 19a912a: feat: set event max listeners to 15

## 1.4.0

### Minor Changes

- e71e509: feat: adjust `package.json` field, delete `module` and `exports` field

  feat: 调整 `package.json` 中字段，删除 `module` 和 `exports` 字段

## 1.3.0

### Minor Changes

- 7bfff71: feat: remove pacakge-json package dependence

## 1.2.2

### Patch Changes

- fdf8b16: fix: delayPromise not clear timeout

## 1.0.10

### Patch Changes

- c40ea75: feat: bump @modern-js/utils version

## 1.0.9

### Patch Changes

- 4791c02: feat: using prebundled deps from @modern-js/utils

## 1.0.8

### Patch Changes

- e167716: feat: change npm timeout time

## 1.0.7

### Patch Changes

- d1f4956: feat: support noNeedInstall params

## 1.0.6

### Patch Changes

- 0af3795: feat: support change git init branch

## 1.0.5

### Patch Changes

- fix: build product

## 1.0.4

### Patch Changes

- feat: export codesmith utils

## 1.0.3

### Patch Changes

- 3ef5a43: feat: add release workflow

## 1.0.2

### Patch Changes

- a6a1c5c: feat: remove run install '--ignore-scripts' params

## 1.0.1

### Patch Changes

- fix: publish not container dist

## 1.0.0

### Patch Changes

- feat: initial publish
