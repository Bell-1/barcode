#!/bin/bash

# npm 发布前检查脚本

set -e

echo "🔍 开始发布前检查..."

# 检查是否登录 npm
echo "📝 检查 npm 登录状态..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 请先登录 npm: npm login"
    exit 1
fi

echo "✅ npm 登录状态正常 ($(npm whoami))"

# 检查工作目录是否干净
echo "📁 检查工作目录状态..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  工作目录有未提交的更改"
    git status --short
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 运行质量检查
echo "🧹 运行代码检查..."
npm run lint

echo "🔍 运行类型检查..."
npm run type-check

echo "🧪 运行测试..."
npm run test

echo "🏗️  构建项目..."
npm run build

# 检查构建输出
echo "📦 检查构建输出..."
if [ ! -f "dist/index.js" ] || [ ! -f "dist/index.esm.js" ] || [ ! -f "dist/index.umd.js" ]; then
    echo "❌ 构建输出不完整"
    exit 1
fi

echo "✅ 构建输出检查通过"

# 显示包信息
echo "📋 包信息预览..."
npm pack --dry-run

echo "🎉 所有检查通过！准备发布..."
echo ""
echo "发布命令："
echo "  npm version patch && npm publish  # 补丁版本"
echo "  npm version minor && npm publish  # 次要版本" 
echo "  npm version major && npm publish  # 主要版本"
echo ""
echo "或使用快捷命令："
echo "  npm run release:patch"
echo "  npm run release:minor"
echo "  npm run release:major"