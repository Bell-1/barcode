# npm 发布指南

## 🚀 发布流程

### 1. 准备工作

确保你已经：
- 登录到 npm：`npm login`
- 验证登录状态：`npm whoami`
- 确认包名可用：`npm view @innel/barcode`（应该返回 404）

### 2. 发布前检查

运行以下命令进行全面检查：

```bash
# 代码质量检查
npm run lint

# TypeScript 类型检查  
npm run type-check

# 运行测试
npm run test

# 构建项目
npm run build
```

### 3. 版本发布

#### 自动发布（推荐）

```bash
# 补丁版本（1.0.0 -> 1.0.1）
npm run release:patch

# 次要版本（1.0.0 -> 1.1.0）
npm run release:minor

# 主要版本（1.0.0 -> 2.0.0）
npm run release:major
```

#### 手动发布

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 发布到 npm
npm publish
```

### 4. 发布后验证

```bash
# 检查包是否发布成功
npm view @innel/barcode

# 安装并测试
npm install @innel/barcode
```

## 📦 包内容

发布的包将包含：

```
@innel/barcode/
├── dist/              # 构建输出
│   ├── index.js       # CommonJS
│   ├── index.esm.js   # ES Module  
│   ├── index.umd.js   # UMD
│   └── *.d.ts         # TypeScript 类型
├── package.json       # 包配置
├── README.md          # 使用文档
├── LICENSE            # 许可证
└── CHANGELOG.md       # 更新日志
```

## 🔧 npm 配置

### publishConfig

包已配置为公开发布：

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### files 字段

通过 `package.json` 中的 `files` 字段控制包含的文件：

```json
{
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ]
}
```

## 🚨 注意事项

1. **首次发布**：确保包名 `@innel/barcode` 在 npm 上可用
2. **作用域包**：`@innel/` 是作用域包，需要组织权限或付费账户
3. **版本管理**：遵循 [语义化版本](https://semver.org/lang/zh-CN/)
4. **安全检查**：发布前会自动运行所有检查（lint、test、build）

## 🔒 安全配置

### 双因素认证

建议启用 npm 的双因素认证：

```bash
npm profile enable-2fa auth-and-writes
```

### 访问令牌

对于 CI/CD，使用访问令牌而不是密码：

```bash
npm token create --read-only  # 只读令牌
npm token create             # 发布令牌
```

## 📊 发布统计

发布后可以查看包的统计信息：

- npm 页面：https://www.npmjs.com/package/@innel/barcode
- 下载统计：https://npm-stat.com/charts.html?package=@innel/barcode