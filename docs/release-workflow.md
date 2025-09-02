# 🚀 版本发布工作流

## 发布流程

### 1. 开发完成
- 确保所有功能开发完成
- 代码已合并到主分支
- 所有测试通过

### 2. 发布前检查
```bash
# 运行发布前检查脚本
npm run check-publish
```

### 3. 更新文档
- 更新 `CHANGELOG.md`
- 确保 `README.md` 是最新的
- 检查示例代码是否正确

### 4. 版本发布

#### 方式一：使用快捷命令（推荐）
```bash
# 补丁版本（bug 修复）
npm run release:patch

# 次要版本（新功能）
npm run release:minor

# 主要版本（破坏性更改）
npm run release:major
```

#### 方式二：手动发布
```bash
# 1. 更新版本
npm version patch  # 或 minor, major

# 2. 推送标签
git push --follow-tags

# 3. 发布
npm publish
```

### 5. 发布后验证
```bash
# 检查包信息
npm view @fuse/barcode

# 测试安装
npm install @fuse/barcode@latest
```

## 版本策略

遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)：

- **MAJOR**（主版本）：不兼容的 API 修改
- **MINOR**（次版本）：向下兼容的功能性新增
- **PATCH**（修订版本）：向下兼容的 bug 修复

### 版本示例

```
1.0.0 → 1.0.1  (patch)  # 修复了条形码生成 bug
1.0.1 → 1.1.0  (minor)  # 新增了 QR 码支持
1.1.0 → 2.0.0  (major)  # 重构 API，不向下兼容
```

## 自动化钩子

项目配置了以下 npm 生命周期钩子：

- **preversion**: 发布前运行 lint、type-check、test
- **prepublishOnly**: 发布前自动构建
- **postpublish**: 发布后显示成功消息

## 发布清单

- [ ] 所有测试通过
- [ ] 代码检查通过
- [ ] 类型检查通过
- [ ] 构建成功
- [ ] 文档更新
- [ ] CHANGELOG 更新
- [ ] npm 登录状态正常
- [ ] 版本号符合语义化规范