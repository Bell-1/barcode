# @fuse/barcode
# @innel/barcode 📊

> 现代化条形码生成器 - 完美支持 Web、H5 和微信小程序环境，专为跨平台开发优化

[![npm version](https://img.shields.io/npm/v/@innel/barcode.svg)](https://www.npmjs.com/package/@innel/barcode)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@innel/barcode.svg)](https://www.npmjs.com/package/@innel/barcode)

## 🎉 为什么选择 @innel/barcode？

- ✅ **零配置开始**：开箱即用，无需复杂设置
- ✅ **完美兼容小程序**：专门解决微信小程序 Canvas 兼容性问题
- ✅ **极致贴边显示**：智能边距计算，充分利用显示空间
- ✅ **TypeScript 原生**：完整类型支持，开发体验极佳
- ✅ **零依赖设计**：轻量级，不会拖累你的项目

## ✨ 核心特性

### 🎯 跨平台兼容
- **Web 浏览器**：支持所有现代浏览器，包括移动端
- **微信小程序**：完美解决 Canvas API 差异和 base64 生成问题
- **UniApp**：一套代码，多端运行
- **React/Vue**：提供完整的框架集成示例

### 📊 多格式支持
- **CODE128**：高密度线性条形码，支持所有 ASCII 字符
- **CODE39**：工业标准条形码，数字和大写字母
- **EAN13**：国际商品条码，12-13位数字自动校验

### 🎨 灵活输出
- **Canvas 绘制**：直接在页面 Canvas 上绘制，性能最佳
- **Base64 图片**：生成图片数据，便于存储和传输
- **SVG 备用**：在不支持 Canvas 的环境自动降级

### ⚡ 性能优化
- **智能边距**：自动计算最优边距，实现贴边显示
- **像素级精确**：动态分配像素，确保条形码清晰锐利
- **内存友好**：无内存泄漏，适合长时间运行的应用

## 📦 安装

```bash
# npm
npm install @innel/barcode

# yarn
yarn add @innel/barcode

# pnpm
pnpm add @innel/barcode
```

## 🚀 快速开始

### 📱 微信小程序 / UniApp （推荐）

这是最常用的场景，专门为微信小程序优化：

``vue
<template>
  <view class="barcode-container">
    <!-- 微信小程序 Canvas -->
    <!-- #ifdef MP-WEIXIN -->
    <canvas
      canvas-id="barcode"
      :style="canvasStyle"
      class="barcode-canvas"
    ></canvas>
    <!-- #endif -->
    
    <!-- Web 端图片显示 -->
    <!-- #ifdef WEB -->
    <image
      v-if="barcodeImage"
      :src="barcodeImage"
      class="barcode-image"
      mode="aspectFit"
    />
    <!-- #endif -->
    
    <!-- 条形码数字显示 -->
    <text class="barcode-text">
      {{ medicalNo }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { createBarcodeGenerator } from '@innel/barcode'

const medicalNo = ref('123456789012')
const barcodeImage = ref('')

// 尺寸配置（重要：贴边显示的关键）
const sizeConfig = reactive({
  rpx: {
    canvasWidth: 640,
    canvasHeight: 120, // 极致紧凑，去除多余空白
  },
  px: {
    canvasWidth: 0,
    canvasHeight: 0,
  },
})

const canvasStyle = computed(() => ({
  width: '100%',
  height: `${sizeConfig.rpx.canvasHeight}rpx`,
}))

// 环境检测
const isWeb = ref(false)
const isMiniProgram = ref(false)

// #ifdef WEB
isWeb.value = true
// #endif

// #ifdef MP-WEIXIN
isMiniProgram.value = true
// #endif

onMounted(() => {
  calculateSizes()
  generateBarcode()
})

// 计算实际像素尺寸
function calculateSizes() {
  const systemInfo = uni.getSystemInfoSync()
  const screenWidth = systemInfo.windowWidth || 375
  const rpxRatio = screenWidth / 750
  
  sizeConfig.px.canvasWidth = Math.floor(sizeConfig.rpx.canvasWidth * rpxRatio)
  sizeConfig.px.canvasHeight = Math.floor(sizeConfig.rpx.canvasHeight * rpxRatio)
}

// 生成条形码
function generateBarcode() {
  const generator = createBarcodeGenerator()
  
  if (isWeb.value) {
    // Web 环境：生成 base64 图片
    const result = generator.generate({
      data: medicalNo.value,
      type: 'CODE128',
      width: sizeConfig.px.canvasWidth,
      height: sizeConfig.px.canvasHeight,
      displayText: false, // 文字在外部显示
      margin: 0, // 完全贴边
    })
    
    if (result.success) {
      barcodeImage.value = result.base64!
    }
  } else if (isMiniProgram.value) {
    // 小程序环境：直接绘制到 Canvas
    const result = generator.generate({
      data: medicalNo.value,
      type: 'CODE128',
      width: sizeConfig.px.canvasWidth,
      height: sizeConfig.px.canvasHeight,
      displayText: false,
      margin: 0,
    })
    
    if (result.success && result.barcodeData) {
      const ctx = uni.createCanvasContext('barcode')
      
      // 使用优化的贴边绘制方法
      generator.drawOnCanvasWithFixedRatio(
        ctx,
        result.barcodeData,
        sizeConfig.px.canvasWidth,
        sizeConfig.px.canvasHeight
      )
    }
  }
}
</script>

<style>
.barcode-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.barcode-canvas,
.barcode-image {
  width: 100%;
  background: #fff;
}

.barcode-text {
  margin-top: 10rpx;
  font-size: 28rpx;
  letter-spacing: 16rpx;
  text-align: center;
}
</style>
```

### 🌐 Web 浏览器

完美兼容现代浏览器，支持 React、Vue 等框架：

``typescript
import { createBarcodeGenerator } from '@innel/barcode'

// 生成 base64 图片
const generator = createBarcodeGenerator()
const result = generator.generate({
  data: 'WEB123456',
  type: 'CODE128',
  width: 400,
  height: 120,
  displayText: true,
})

if (result.success) {
  console.log('生成成功:', result.base64)
  // 可以直接设置给 img 标签的 src
  document.getElementById('barcode-img').src = result.base64
}
```

### 📱 React 集成示例

``tsx
import React, { useEffect, useRef, useState } from 'react'
import { createBarcodeGenerator } from '@innel/barcode'

const BarcodeComponent: React.FC<{ data: string }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [barcodeImage, setBarcodeImage] = useState('')
  
  useEffect(() => {
    const generator = createBarcodeGenerator()
    
    // 方法1：生成 base64 图片
    const result = generator.generate({
      data,
      type: 'CODE128',
      width: 300,
      height: 100,
    })
    
    if (result.success) {
      setBarcodeImage(result.base64!)
    }
    
    // 方法2：直接绘制到 Canvas
    if (canvasRef.current && result.success && result.barcodeData) {
      const ctx = canvasRef.current.getContext('2d')!
      generator.drawOnCanvas(ctx, result.barcodeData, 0, 0)
    }
  }, [data])
  
  return (
    <div className="barcode-container">
      {/* 图片显示 */}
      {barcodeImage && (
        <img src={barcodeImage} alt="Barcode" className="barcode-image" />
      )}
      
      {/* Canvas 显示 */}
      <canvas ref={canvasRef} width={300} height={100} className="barcode-canvas" />
      
      {/* 数字显示 */}
      <div className="barcode-text">{data}</div>
    </div>
  )
}

export default BarcodeComponent
```

### 🌿 Vue 3 集成示例

``vue
<template>
  <div class="barcode-container">
    <img v-if="barcodeImage" :src="barcodeImage" alt="Barcode" class="barcode-image" />
    <canvas ref="canvasRef" width="300" height="100" class="barcode-canvas"></canvas>
    <div class="barcode-text">{{ data }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { createBarcodeGenerator } from '@innel/barcode'

interface Props {
  data: string
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement>()
const barcodeImage = ref('')

const generateBarcode = () => {
  const generator = createBarcodeGenerator()
  
  const result = generator.generate({
    data: props.data,
    type: 'CODE128',
    width: 300,
    height: 100,
  })
  
  if (result.success) {
    barcodeImage.value = result.base64!
    
    // 同时绘制到 Canvas
    if (canvasRef.value && result.barcodeData) {
      const ctx = canvasRef.value.getContext('2d')!
      generator.drawOnCanvas(ctx, result.barcodeData, 0, 0)
    }
  }
}

onMounted(generateBarcode)
watch(() => props.data, generateBarcode)
</script>

<style scoped>
.barcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.barcode-image,
.barcode-canvas {
  border: 1px solid #e0e0e0;
  background: white;
}

.barcode-text {
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 2px;
}
</style>
```

## ⚡ 高级特性

### 🎯 智能贴边显示

针对微信小程序环境特别优化，解决条形码两侧空白过多的问题：

``typescript
// 使用优化的贴边绘制方法
const generator = createBarcodeGenerator()
const result = generator.generate({
  data: 'MINIPROGRAM',
  type: 'CODE128',
  width: canvasWidth,
  height: canvasHeight,
  margin: 0, // 完全贴边
  displayText: false, // 文字在外部显示
})

if (result.success && result.barcodeData) {
  const ctx = uni.createCanvasContext('barcode')
  
  // 使用智能贴边算法
  generator.drawOnCanvasWithFixedRatio(
    ctx,
    result.barcodeData,
    canvasWidth,
    canvasHeight
  )
}
```

### 🔄 环境自适应

自动检测运行环境，选择最优的渲染方式：

- **Web 浏览器**：使用原生 Canvas API，性能最佳
- **微信小程序**：兼容小程序 Canvas API 差异
- **其他环境**：自动降级到 SVG 生成

### 📦 多输出格式

``typescript
const generator = createBarcodeGenerator()
const result = generator.generate({
  data: 'MULTIFORMAT',
  type: 'CODE128',
})

if (result.success) {
  // 1. base64 图片（通用）
  console.log('Base64:', result.base64)
  
  // 2. 数组数据（用于自定义渲染）
  console.log('Binary data:', result.data)
  
  // 3. 条形码元数据
  console.log('Metadata:', result.barcodeData)
}
```

## 📚 API 文档

### createBarcodeGenerator()

创建条形码生成器实例（推荐方式）。

```typescript
import { createBarcodeGenerator } from '@innel/barcode'

const generator = createBarcodeGenerator()
```

### BarcodeGenerator 类

#### generate(options)

生成条形码数据。

**参数：**
- `options: BarcodeOptions` - 条形码配置

**返回：** `BarcodeResult`

```typescript
interface BarcodeResult {
  success: boolean
  base64?: string // base64 图片数据
  barcodeData?: BarcodeData // 条形码元数据
  data?: number[] // 二进制数据数组
  width?: number // 实际宽度
  height?: number // 实际高度
  error?: string // 错误信息
}
```

#### drawOnCanvas(ctx, barcodeData, x?, y?)

在 Canvas 上绘制条形码。

**参数：**
- `ctx: CanvasContext` - Canvas 上下文
- `barcodeData: BarcodeData` - 条形码数据
- `x?: number` - 绘制起始 X 坐标（默认 0）
- `y?: number` - 绘制起始 Y 坐标（默认 0）

#### drawOnCanvasWithFixedRatio(ctx, barcodeData, canvasWidth, canvasHeight)

小程序优化版：贴边绘制条形码。

**参数：**
- `ctx: CanvasContext` - Canvas 上下文
- `barcodeData: BarcodeData` - 条形码数据
- `canvasWidth: number` - Canvas 实际宽度（px）
- `canvasHeight: number` - Canvas 实际高度（px）

### 便捷函数（已徃用）

为了更好的 TypeScript 支持，推荐使用 `createBarcodeGenerator()` 方式。
    <img v-if="barcodeImage" :src="barcodeImage" alt="Barcode" />
    <canvas ref="canvasRef" width="300" height="100"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generateBarcode, drawBarcodeOnCanvas } from '@fuse/barcode'

const canvasRef = ref<HTMLCanvasElement>()
const barcodeImage = ref('')

onMounted(() => {
  // 生成 base64 图片
  const result = generateBarcode('Vue 3 Barcode', 'CODE128', {
    width: 300,
    height: 100,
  })

  if (result.success) {
    barcodeImage.value = result.base64 || ''
  }

  // 在 Canvas 上绘制
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')!
    drawBarcodeOnCanvas(ctx, 'VUE123', 'CODE39', 0, 0, {
      width: 300,
      height: 100,
    })
  }
})
</script>
```

## 🛠️ 常见问题

### Q: 微信小程序中条形码两侧空白太多？

A: 使用优化的配置：

``typescript
// 设置更小的 Canvas 高度
canvasHeight: 120, // rpx

// 使用贴边配置
const result = generator.generate({
  margin: 0, // 完全贴边
  displayText: false, // 文字在外部显示
})

// 使用优化的绘制方法
generator.drawOnCanvasWithFixedRatio(ctx, barcodeData, width, height)
```

### Q: 如何在 TypeScript 中获得完整的类型支持？

A: 使用推荐的导入方式：

``typescript
import { createBarcodeGenerator, type BarcodeOptions } from '@innel/barcode'

// 完整的类型提示
const options: BarcodeOptions = {
  data: 'HELLO',
  type: 'CODE128', // 自动补全
  width: 300,
  height: 100,
}
```

### Q: 支持哪些浏览器？

A: 支持所有现代浏览器：
- Chrome 50+
- Firefox 45+
- Safari 10+
- Edge 79+
- 微信小程序
- 各类移动端浏览器

### Q: 如何自定义条形码样式？

A: 通过配置选项进行个性化：

``typescript
const result = generator.generate({
  data: 'CUSTOM',
  color: '#2563eb', // 蓝色条形码
  backgroundColor: '#f8fafc', // 浅灰背景
  textColor: '#1e293b', // 深灰文字
  fontSize: 16, // 大号字体
  margin: 20, // 较大边距
})
```

## 🔧 开发和贡献

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/barcode.git
cd barcode

# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm run dev

# 构建生产版本
pnpm run build

# 运行测试
pnpm run test

# 代码检查
pnpm run lint
pnpm run lint:fix

# 类型检查
pnpm run type-check
```

### 项目结构

```
barcode/
├── src/
│   ├── core.ts          # 核心生成器类
│   └── index.ts         # 导出入口
├── dist/               # 构建输出
├── examples/           # 示例代码
│   ├── web/            # Web 示例
│   └── uniapp/         # UniApp 示例
├── tests/              # 单元测试
├── package.json
├── rollup.config.js    # 打包配置
└── tsconfig.json       # TypeScript 配置
```

## 📄 更新日志

### v1.0.5 (2024-01-XX)
- ✨ 新增 `drawOnCanvasWithFixedRatio` 方法，专为小程序优化
- 🐛 修复微信小程序中条形码两侧空白过多的问题
- 💎 优化边距计算算法，实现真正的贴边显示
- 📚 完善文档和示例代码

### v1.0.4 (2024-01-XX)
- 🐛 修复文字显示问题
- ⚙️ 优化尺寸计算算法

### v1.0.3 (2024-01-XX)
- 🐛 修复比例异常问题
- ⚡ 提升渲染性能

### v1.0.2 (2024-01-XX)
- 🐛 修复 TypeScript 类型错误
- ✨ 新增 CanvasContext 类型定义

### v1.0.0 (2024-01-XX)
- 🎉 首次发布
- ✨ 支持 CODE128、CODE39、EAN13 格式
- ✨ 完美兼容 Web 和微信小程序

## 📄 许可证

[MIT License](./LICENSE)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

如果这个项目对您有帮助，请给一个 ⭐️ **Star** 支持一下！

---

<div align="center">
  <strong>📊 @innel/barcode - 专业的跨平台条形码生成器</strong>
</div>