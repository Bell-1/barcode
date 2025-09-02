# 更新日志

本项目的所有重要更改都将记录在此文件中。

## [1.0.0] - 2025-09-02

### 新增

- 🎉 初始版本发布
- ✨ 支持 CODE128、CODE39、EAN13 条形码格式
- 🌐 兼容 Web 浏览器、H5 和微信小程序环境
- 🎨 提供 Canvas 绘制和 base64 图片输出功能
- 📝 完整的 TypeScript 类型支持
- 🔧 零外部依赖设计
- 📚 详细的文档和示例代码
- 🧪 完整的单元测试覆盖
- 📦 支持 CommonJS、ES Module 和 UMD 三种模块格式

### 特性

- **BarcodeGenerator 类**：核心条形码生成器
- **generateBarcode 函数**：快速生成条形码的便捷方法
- **drawBarcodeOnCanvas 函数**：直接在 Canvas 上绘制条形码
- **丰富的配置选项**：支持自定义宽度、高度、颜色、字体等
- **自动校验位计算**：EAN13 格式自动计算校验位
- **错误处理**：完善的输入验证和错误提示

### 示例

- 📄 Web 浏览器示例（HTML + JavaScript）
- ⚛️ React 示例（TypeScript）
- 📱 UniApp 示例（Vue + 小程序兼容）

### 文档

- 📖 详细的 README.md 使用说明
- 🔧 完整的 API 文档
- 🎯 多个使用场景示例
- 🚀 快速开始指南
