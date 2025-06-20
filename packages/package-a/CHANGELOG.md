# package-a

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.6](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.2.6) (2025-06-19)


### 📝 Documentation

* **package-a:** 修改测试文件（继续测试第17次） ([30b85d9](https://github.com/huoshan25/monorepo-changeset-test/commit/30b85d9))

### 🧹 Chores

* 优化release.js文件，增加配置常量和正则表达式，重构获取changeset文件的逻辑，改进去重和合并变更的性能，确保更高效的相似度检查，并添加安全的文件操作工具。 ([e3bf62d](https://github.com/huoshan25/monorepo-changeset-test/commit/e3bf62d))

## [1.2.5](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.2.5) (2025-06-19)

### 📝 Documentation

- **package-a:** 修改测试文件（继续测试第 16 次） ([ee74f05](https://github.com/huoshan25/monorepo-changeset-test/commit/ee74f05))

## [1.2.4](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.2.4) (2025-06-19)

### 📝 Documentation

- **package-a:** 修改测试文件（测试去重优先级） ([c16685a](https://github.com/huoshan25/monorepo-changeset-test/commit/c16685a))

### 🧹 Chores

- 修复 deduplicateChanges 函数中的优先级逻辑，确保 git 提交优先于 changeset 变更，并更新去重检查的相关日志信息。 ([02d9946](https://github.com/huoshan25/monorepo-changeset-test/commit/02d9946))

## [1.2.3](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.2.3) (2025-06-19)

### 📝 Documentation

- docs(package-a): 修改测试文件（继续测试第 15 次）

## [1.2.2](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.2.2) (2025-06-19)

### 📝 Documentation

- docs(package-a): 修改测试文件（继续测试第 14 次）

### 🧹 Chores

- 优化相似度计算算法，增加对中文数字表达的标准化处理，改进关键词过滤逻辑以提高相似度判断准确性。 ([874d3aa](https://github.com/huoshan25/monorepo-changeset-test/commit/874d3aa))

## [1.2.1](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.2.1) (2025-06-19)

### 📝 Documentation

- docs(package-a): 修改测试文件（继续测试第 13 次）
- **package-a:** 修改测试文件（继续测试第 13 次） ([f9f4fc4](https://github.com/huoshan25/monorepo-changeset-test/commit/f9f4fc4))

### 🧹 Chores

- 优化获取最新提交信息的逻辑，添加对最后一次发布提交的自动检测；改进变更相似度检查算法，使用编辑距离计算相似度；更新生成 CHANGELOG 的函数以支持传入 changeset 变更信息。 ([bc93685](https://github.com/huoshan25/monorepo-changeset-test/commit/bc93685))

## [1.2.0](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.2.0) (2025-06-19)

### ✨ Features

- feat(package-a): 添加用户权限管理系统

## [1.1.0](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.1.0) (2025-06-19)

### ✨ Features

- **package-a:** 添加用户认证功能，支持 JWT 和 OAuth2 登录 ([7f546c1](https://github.com/huoshan25/monorepo-changeset-test/commit/7f546c1))

## [1.0.19](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.19) (2025-06-19)

### ✨ Features

- **package-a:** 添加新的测试功能用于验证去重逻辑 ([fe2f853](https://github.com/huoshan25/monorepo-changeset-test/commit/fe2f853))

### 🧹 Chores

- 优化 CHANGELOG 生成逻辑，添加变更去重和合并功能，过滤发布相关提交信息 ([ac9ff81](https://github.com/huoshan25/monorepo-changeset-test/commit/ac9ff81))

## [1.0.18](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.18) (2025-06-19)

### 🧹 Chores

- 空提交

## [1.0.17](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.17) (2025-06-19)

### ✨ Features

- **release:** 添加获取最新提交和分类功能，优化 CHANGELOG 生成逻辑 ([99186f8](https://github.com/huoshan25/monorepo-changeset-test/commit/99186f8))

### 📝 Documentation

- **package-a:** 修改测试文件（继续测试第 12 次） ([e511755](https://github.com/huoshan25/monorepo-changeset-test/commit/e511755))
- docs(package-a): 修改测试文件（继续测试第 12 次）

## [1.0.16](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.16) (2025-06-19)

### 📝 Documentation

- docs(package-a): 测试从 changeset 文件中提取变更信息的功能
- docs(package-a): 最终测试 CHANGELOG 修复，应该正确显示 changeset 变更内容
- docs(package-a): 测试手动 CHANGELOG 生成，应该只包含最新变更

## [1.0.15](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.15) (2025-06-19)

## [1.0.14](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.14) (2025-06-19)

### [1.0.13](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.13) (2025-06-19)

### 📝 Documentation

- **package-a:** 删除 CHANGELOG.md 文件 ([b13329d](https://github.com/huoshan25/monorepo-changeset-test/commit/b13329d51403a1abdf4ff3bfdfc69d6dd467f4be))
- **package-a:** 新增测试文件 ([22834ad](https://github.com/huoshan25/monorepo-changeset-test/commit/22834ad7148da357183a12543941ad93c43fb6bb))
- **package-a:** 修改测试文件 ([d2a802a](https://github.com/huoshan25/monorepo-changeset-test/commit/d2a802ad0a0f50eb8230077952c23c13fe701f04))
- **package-a:** 修改测试文件 ([e0637fe](https://github.com/huoshan25/monorepo-changeset-test/commit/e0637febdc416989675a477d4876dbc53b0b2051))
- **package-a:** 修改测试文件（继续测试第 10 次） ([4d3c6b5](https://github.com/huoshan25/monorepo-changeset-test/commit/4d3c6b5de40c0b879cdb90d80d62a7e276f703f6))
- **package-a:** 修改测试文件（继续测试第 11 次） ([515ed4d](https://github.com/huoshan25/monorepo-changeset-test/commit/515ed4d2085568bce96780e568f4507e0be1e573))
- **package-a:** 修改测试文件（继续测试第 7 次） ([e27723a](https://github.com/huoshan25/monorepo-changeset-test/commit/e27723a7cbe30b9bb5c2ee7379186539954cf5e0))
- **package-a:** 修改测试文件（继续测试第二次） ([4b8bde4](https://github.com/huoshan25/monorepo-changeset-test/commit/4b8bde42bb8bb72b2a8e7e95163d15813c818bc4))
- **package-a:** 修改测试文件（继续测试第六次） ([6a4c3d3](https://github.com/huoshan25/monorepo-changeset-test/commit/6a4c3d3b09516fee3d8d2ba31d94716d1a7e1947))
- **package-a:** 修改测试文件（继续测试第三次） ([13753e9](https://github.com/huoshan25/monorepo-changeset-test/commit/13753e9455e4d36fdc630c3156204aef06abe984))
- **package-a:** 修改测试文件（继续测试第四次） ([5178f08](https://github.com/huoshan25/monorepo-changeset-test/commit/5178f08eb1e2117da1b95834eb64a86290fc18b9))
- **package-a:** 修改测试文件（继续测试第五次） ([cfbb791](https://github.com/huoshan25/monorepo-changeset-test/commit/cfbb791a6b2073fa73bed129316402dbd2a549df))

### 🧹 Chores

- **release:** 发布新版本 ([e53b48e](https://github.com/huoshan25/monorepo-changeset-test/commit/e53b48ec456b10ca1af5a50369dc39a631bbfa37))
- **release:** 发布新版本 ([5d30058](https://github.com/huoshan25/monorepo-changeset-test/commit/5d30058607b092e84a94c36779e3cb26f12fe74a))
- **release:** 发布新版本 ([e73739a](https://github.com/huoshan25/monorepo-changeset-test/commit/e73739acb72ccee8b283bd5ba264db4f09f29408))
- **release:** 发布新版本 ([f5d1db0](https://github.com/huoshan25/monorepo-changeset-test/commit/f5d1db097ab2395b9c1f9241ed862de91523aa88))
- **release:** 发布新版本 ([ae71c64](https://github.com/huoshan25/monorepo-changeset-test/commit/ae71c64b137504505610f1b1cd87df1c89a9a5b2))
- **release:** 发布新版本 [package-a, project-a] - package-a@1.0.6, project-a@1.0.0 ([7ae23ab](https://github.com/huoshan25/monorepo-changeset-test/commit/7ae23ababbf4d5b57a9009c5539399b5c1e94b35))
- **release:** 发布新版本 [package-a] - package-a@1.0.10 ([9cb973e](https://github.com/huoshan25/monorepo-changeset-test/commit/9cb973e5cd9ed03fd257aca3da307f005f3a352f))
- **release:** 发布新版本 [package-a] - package-a@1.0.11 ([eae988e](https://github.com/huoshan25/monorepo-changeset-test/commit/eae988e390ad6a3a73e70461b3d7a962ab4188ab))
- **release:** 发布新版本 [package-a] - package-a@1.0.12 ([b113b2a](https://github.com/huoshan25/monorepo-changeset-test/commit/b113b2afc90f785d4d83f7dd2ee1c9ae26676bda))
- **release:** 发布新版本 [package-a] - package-a@1.0.9 ([7939cc5](https://github.com/huoshan25/monorepo-changeset-test/commit/7939cc56f8081ba59727cd5c0ee8a0246a0709fa))
- **release:** 更新版本至 1.0.7，修改 CHANGELOG 以记录测试文件的更新 ([20a2182](https://github.com/huoshan25/monorepo-changeset-test/commit/20a2182420fe321b061ba16274236912e458f8b9))
- **release:** 更新版本至 1.0.8，优化变更检查逻辑并生成详细的 CHANGELOG ([00124bd](https://github.com/huoshan25/monorepo-changeset-test/commit/00124bd1ff3d0588c7219f0e271645ef8633a674))

### [1.0.12](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.12) (2025-06-19)

### 📝 Documentation

- **package-a:** 删除 CHANGELOG.md 文件 ([b13329d](https://github.com/huoshan25/monorepo-changeset-test/commit/b13329d51403a1abdf4ff3bfdfc69d6dd467f4be))
- **package-a:** 新增测试文件 ([22834ad](https://github.com/huoshan25/monorepo-changeset-test/commit/22834ad7148da357183a12543941ad93c43fb6bb))
- **package-a:** 修改测试文件 ([d2a802a](https://github.com/huoshan25/monorepo-changeset-test/commit/d2a802ad0a0f50eb8230077952c23c13fe701f04))
- **package-a:** 修改测试文件 ([e0637fe](https://github.com/huoshan25/monorepo-changeset-test/commit/e0637febdc416989675a477d4876dbc53b0b2051))
- **package-a:** 修改测试文件（继续测试第 10 次） ([4d3c6b5](https://github.com/huoshan25/monorepo-changeset-test/commit/4d3c6b5de40c0b879cdb90d80d62a7e276f703f6))
- **package-a:** 修改测试文件（继续测试第 11 次） ([515ed4d](https://github.com/huoshan25/monorepo-changeset-test/commit/515ed4d2085568bce96780e568f4507e0be1e573))
- **package-a:** 修改测试文件（继续测试第 7 次） ([e27723a](https://github.com/huoshan25/monorepo-changeset-test/commit/e27723a7cbe30b9bb5c2ee7379186539954cf5e0))
- **package-a:** 修改测试文件（继续测试第二次） ([4b8bde4](https://github.com/huoshan25/monorepo-changeset-test/commit/4b8bde42bb8bb72b2a8e7e95163d15813c818bc4))
- **package-a:** 修改测试文件（继续测试第六次） ([6a4c3d3](https://github.com/huoshan25/monorepo-changeset-test/commit/6a4c3d3b09516fee3d8d2ba31d94716d1a7e1947))
- **package-a:** 修改测试文件（继续测试第三次） ([13753e9](https://github.com/huoshan25/monorepo-changeset-test/commit/13753e9455e4d36fdc630c3156204aef06abe984))
- **package-a:** 修改测试文件（继续测试第四次） ([5178f08](https://github.com/huoshan25/monorepo-changeset-test/commit/5178f08eb1e2117da1b95834eb64a86290fc18b9))
- **package-a:** 修改测试文件（继续测试第五次） ([cfbb791](https://github.com/huoshan25/monorepo-changeset-test/commit/cfbb791a6b2073fa73bed129316402dbd2a549df))

### 🧹 Chores

- **release:** 发布新版本 ([e53b48e](https://github.com/huoshan25/monorepo-changeset-test/commit/e53b48ec456b10ca1af5a50369dc39a631bbfa37))
- **release:** 发布新版本 ([5d30058](https://github.com/huoshan25/monorepo-changeset-test/commit/5d30058607b092e84a94c36779e3cb26f12fe74a))
- **release:** 发布新版本 ([e73739a](https://github.com/huoshan25/monorepo-changeset-test/commit/e73739acb72ccee8b283bd5ba264db4f09f29408))
- **release:** 发布新版本 ([f5d1db0](https://github.com/huoshan25/monorepo-changeset-test/commit/f5d1db097ab2395b9c1f9241ed862de91523aa88))
- **release:** 发布新版本 ([ae71c64](https://github.com/huoshan25/monorepo-changeset-test/commit/ae71c64b137504505610f1b1cd87df1c89a9a5b2))
- **release:** 发布新版本 [package-a, project-a] - package-a@1.0.6, project-a@1.0.0 ([7ae23ab](https://github.com/huoshan25/monorepo-changeset-test/commit/7ae23ababbf4d5b57a9009c5539399b5c1e94b35))
- **release:** 发布新版本 [package-a] - package-a@1.0.10 ([9cb973e](https://github.com/huoshan25/monorepo-changeset-test/commit/9cb973e5cd9ed03fd257aca3da307f005f3a352f))
- **release:** 发布新版本 [package-a] - package-a@1.0.11 ([eae988e](https://github.com/huoshan25/monorepo-changeset-test/commit/eae988e390ad6a3a73e70461b3d7a962ab4188ab))
- **release:** 发布新版本 [package-a] - package-a@1.0.9 ([7939cc5](https://github.com/huoshan25/monorepo-changeset-test/commit/7939cc56f8081ba59727cd5c0ee8a0246a0709fa))
- **release:** 更新版本至 1.0.7，修改 CHANGELOG 以记录测试文件的更新 ([20a2182](https://github.com/huoshan25/monorepo-changeset-test/commit/20a2182420fe321b061ba16274236912e458f8b9))
- **release:** 更新版本至 1.0.8，优化变更检查逻辑并生成详细的 CHANGELOG ([00124bd](https://github.com/huoshan25/monorepo-changeset-test/commit/00124bd1ff3d0588c7219f0e271645ef8633a674))

### [1.0.11](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.11) (2025-06-19)

### 🧹 Chores

- **release:** 发布新版本 ([e53b48e](https://github.com/huoshan25/monorepo-changeset-test/commit/e53b48ec456b10ca1af5a50369dc39a631bbfa37))
- **release:** 发布新版本 ([5d30058](https://github.com/huoshan25/monorepo-changeset-test/commit/5d30058607b092e84a94c36779e3cb26f12fe74a))
- **release:** 发布新版本 ([e73739a](https://github.com/huoshan25/monorepo-changeset-test/commit/e73739acb72ccee8b283bd5ba264db4f09f29408))
- **release:** 发布新版本 ([f5d1db0](https://github.com/huoshan25/monorepo-changeset-test/commit/f5d1db097ab2395b9c1f9241ed862de91523aa88))
- **release:** 发布新版本 ([ae71c64](https://github.com/huoshan25/monorepo-changeset-test/commit/ae71c64b137504505610f1b1cd87df1c89a9a5b2))
- **release:** 发布新版本 [package-a, project-a] - package-a@1.0.6, project-a@1.0.0 ([7ae23ab](https://github.com/huoshan25/monorepo-changeset-test/commit/7ae23ababbf4d5b57a9009c5539399b5c1e94b35))
- **release:** 发布新版本 [package-a] - package-a@1.0.10 ([9cb973e](https://github.com/huoshan25/monorepo-changeset-test/commit/9cb973e5cd9ed03fd257aca3da307f005f3a352f))
- **release:** 发布新版本 [package-a] - package-a@1.0.9 ([7939cc5](https://github.com/huoshan25/monorepo-changeset-test/commit/7939cc56f8081ba59727cd5c0ee8a0246a0709fa))
- **release:** 更新版本至 1.0.7，修改 CHANGELOG 以记录测试文件的更新 ([20a2182](https://github.com/huoshan25/monorepo-changeset-test/commit/20a2182420fe321b061ba16274236912e458f8b9))
- **release:** 更新版本至 1.0.8，优化变更检查逻辑并生成详细的 CHANGELOG ([00124bd](https://github.com/huoshan25/monorepo-changeset-test/commit/00124bd1ff3d0588c7219f0e271645ef8633a674))

### 📝 Documentation

- **package-a:** 删除 CHANGELOG.md 文件 ([b13329d](https://github.com/huoshan25/monorepo-changeset-test/commit/b13329d51403a1abdf4ff3bfdfc69d6dd467f4be))
- **package-a:** 新增测试文件 ([22834ad](https://github.com/huoshan25/monorepo-changeset-test/commit/22834ad7148da357183a12543941ad93c43fb6bb))
- **package-a:** 修改测试文件 ([d2a802a](https://github.com/huoshan25/monorepo-changeset-test/commit/d2a802ad0a0f50eb8230077952c23c13fe701f04))
- **package-a:** 修改测试文件 ([e0637fe](https://github.com/huoshan25/monorepo-changeset-test/commit/e0637febdc416989675a477d4876dbc53b0b2051))
- **package-a:** 修改测试文件（继续测试第 10 次） ([4d3c6b5](https://github.com/huoshan25/monorepo-changeset-test/commit/4d3c6b5de40c0b879cdb90d80d62a7e276f703f6))
- **package-a:** 修改测试文件（继续测试第 11 次） ([515ed4d](https://github.com/huoshan25/monorepo-changeset-test/commit/515ed4d2085568bce96780e568f4507e0be1e573))
- **package-a:** 修改测试文件（继续测试第 7 次） ([e27723a](https://github.com/huoshan25/monorepo-changeset-test/commit/e27723a7cbe30b9bb5c2ee7379186539954cf5e0))
- **package-a:** 修改测试文件（继续测试第二次） ([4b8bde4](https://github.com/huoshan25/monorepo-changeset-test/commit/4b8bde42bb8bb72b2a8e7e95163d15813c818bc4))
- **package-a:** 修改测试文件（继续测试第六次） ([6a4c3d3](https://github.com/huoshan25/monorepo-changeset-test/commit/6a4c3d3b09516fee3d8d2ba31d94716d1a7e1947))
- **package-a:** 修改测试文件（继续测试第三次） ([13753e9](https://github.com/huoshan25/monorepo-changeset-test/commit/13753e9455e4d36fdc630c3156204aef06abe984))
- **package-a:** 修改测试文件（继续测试第四次） ([5178f08](https://github.com/huoshan25/monorepo-changeset-test/commit/5178f08eb1e2117da1b95834eb64a86290fc18b9))
- **package-a:** 修改测试文件（继续测试第五次） ([cfbb791](https://github.com/huoshan25/monorepo-changeset-test/commit/cfbb791a6b2073fa73bed129316402dbd2a549df))

### [1.0.10](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v1.0.10) (2025-06-19)

### 🧹 Chores

- **release:** 发布新版本 ([e53b48e](https://github.com/huoshan25/monorepo-changeset-test/commit/e53b48ec456b10ca1af5a50369dc39a631bbfa37))
- **release:** 发布新版本 ([5d30058](https://github.com/huoshan25/monorepo-changeset-test/commit/5d30058607b092e84a94c36779e3cb26f12fe74a))
- **release:** 发布新版本 ([e73739a](https://github.com/huoshan25/monorepo-changeset-test/commit/e73739acb72ccee8b283bd5ba264db4f09f29408))
- **release:** 发布新版本 ([f5d1db0](https://github.com/huoshan25/monorepo-changeset-test/commit/f5d1db097ab2395b9c1f9241ed862de91523aa88))
- **release:** 发布新版本 ([ae71c64](https://github.com/huoshan25/monorepo-changeset-test/commit/ae71c64b137504505610f1b1cd87df1c89a9a5b2))
- **release:** 发布新版本 [package-a, project-a] - package-a@1.0.6, project-a@1.0.0 ([7ae23ab](https://github.com/huoshan25/monorepo-changeset-test/commit/7ae23ababbf4d5b57a9009c5539399b5c1e94b35))
- **release:** 发布新版本 [package-a] - package-a@1.0.9 ([7939cc5](https://github.com/huoshan25/monorepo-changeset-test/commit/7939cc56f8081ba59727cd5c0ee8a0246a0709fa))
- **release:** 更新版本至 1.0.7，修改 CHANGELOG 以记录测试文件的更新 ([20a2182](https://github.com/huoshan25/monorepo-changeset-test/commit/20a2182420fe321b061ba16274236912e458f8b9))
- **release:** 更新版本至 1.0.8，优化变更检查逻辑并生成详细的 CHANGELOG ([00124bd](https://github.com/huoshan25/monorepo-changeset-test/commit/00124bd1ff3d0588c7219f0e271645ef8633a674))

### 📝 Documentation

- **package-a:** 删除 CHANGELOG.md 文件 ([b13329d](https://github.com/huoshan25/monorepo-changeset-test/commit/b13329d51403a1abdf4ff3bfdfc69d6dd467f4be))
- **package-a:** 新增测试文件 ([22834ad](https://github.com/huoshan25/monorepo-changeset-test/commit/22834ad7148da357183a12543941ad93c43fb6bb))
- **package-a:** 修改测试文件 ([d2a802a](https://github.com/huoshan25/monorepo-changeset-test/commit/d2a802ad0a0f50eb8230077952c23c13fe701f04))
- **package-a:** 修改测试文件 ([e0637fe](https://github.com/huoshan25/monorepo-changeset-test/commit/e0637febdc416989675a477d4876dbc53b0b2051))
- **package-a:** 修改测试文件（继续测试第 10 次） ([4d3c6b5](https://github.com/huoshan25/monorepo-changeset-test/commit/4d3c6b5de40c0b879cdb90d80d62a7e276f703f6))
- **package-a:** 修改测试文件（继续测试第 7 次） ([e27723a](https://github.com/huoshan25/monorepo-changeset-test/commit/e27723a7cbe30b9bb5c2ee7379186539954cf5e0))
- **package-a:** 修改测试文件（继续测试第二次） ([4b8bde4](https://github.com/huoshan25/monorepo-changeset-test/commit/4b8bde42bb8bb72b2a8e7e95163d15813c818bc4))
- **package-a:** 修改测试文件（继续测试第六次） ([6a4c3d3](https://github.com/huoshan25/monorepo-changeset-test/commit/6a4c3d3b09516fee3d8d2ba31d94716d1a7e1947))
- **package-a:** 修改测试文件（继续测试第三次） ([13753e9](https://github.com/huoshan25/monorepo-changeset-test/commit/13753e9455e4d36fdc630c3156204aef06abe984))
- **package-a:** 修改测试文件（继续测试第四次） ([5178f08](https://github.com/huoshan25/monorepo-changeset-test/commit/5178f08eb1e2117da1b95834eb64a86290fc18b9))
- **package-a:** 修改测试文件（继续测试第五次） ([cfbb791](https://github.com/huoshan25/monorepo-changeset-test/commit/cfbb791a6b2073fa73bed129316402dbd2a549df))
