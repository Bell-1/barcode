# 📦 npm 发布快速参考

## 🚀 快速发布

### 检查准备工作
```bash
# 检查登录状态
npm whoami

# 运行发布前检查
npm run check-publish
```

### 一键发布
```bash
# 补丁版本（推荐用于 bug 修复）
npm run release:patch

# 次要版本（推荐用于新功能）
npm run release:minor

# 主要版本（推荐用于破坏性更改）
npm run release:major
```

## 📋 发布清单

- [ ] ✅ npm 登录状态正常
- [ ] ✅ 所有测试通过
- [ ] ✅ 代码检查通过
- [ ] ✅ 类型检查通过
- [ ] ✅ 构建成功
- [ ] ✅ 文档更新
- [ ] ✅ CHANGELOG 更新

## 🔧 包内容预览

```bash
# 查看包内容（不实际打包）
npm pack --dry-run
```

## 📊 发布后验证

```bash
# 查看包信息
npm view @fuse/barcode

# 测试安装
npm install @fuse/barcode@latest
```

## 🆘 常见问题

### 1. 包名已存在
- 确认包名在 npm 上是否可用
- 考虑使用作用域包名（如 `@yourname/barcode`）

### 2. 权限问题
- 确保登录的账户有发布权限
- 对于作用域包，需要组织权限

### 3. 构建失败
- 运行 `npm run clean && npm run build`
- 检查构建日志中的错误信息

更多详细信息请查看：
- 📖 [完整发布指南](./docs/npm-publish.md)
- 🔄 [版本发布流程](./docs/release-workflow.md)