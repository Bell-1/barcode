# @fuse/barcode

> 现代化条形码生成器 - 支持多种格式，兼容 Web、H5 和微信小程序环境

[![npm version](https://img.shields.io/npm/v/@fuse/barcode.svg)](https://www.npmjs.com/package/@fuse/barcode)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 特性

- 🎯 **现代化设计**：完全使用 TypeScript 编写，提供完整的类型支持
- 🔧 **零依赖**：无需外部依赖，轻量级设计
- 🌐 **多环境支持**：兼容 Web 浏览器、H5 和微信小程序
- 📊 **多种格式**：支持 CODE128、CODE39、EAN13 条形码格式
- 🎨 **灵活输出**：支持 Canvas 绘制和 base64 图片输出
- ⚙️ **高度可配置**：丰富的配置选项，满足各种使用场景

## 📦 安装

```bash
# npm
npm install @fuse/barcode

# yarn
yarn add @fuse/barcode

# pnpm
pnpm add @fuse/barcode
```

> **注意**: 如果包名 `@fuse/barcode` 不可用，你可能需要更改包名或使用不同的作用域。

## 🚀 快速开始

### 基础用法

```typescript
import { generateBarcode } from '@fuse/barcode'

// 生成条形码
const result = generateBarcode('Hello World', 'CODE128', {
  width: 300,
  height: 100,
  displayText: true,
})

if (result.success) {
  console.log('Base64 图片:', result.base64)
}
```

### 在 Canvas 上绘制

```typescript
import { drawBarcodeOnCanvas } from '@fuse/barcode'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

// 直接在 Canvas 上绘制条形码
drawBarcodeOnCanvas(ctx, '123456789012', 'EAN13', 0, 0, {
  width: 300,
  height: 150,
  color: '#000000',
  backgroundColor: '#ffffff',
})
```

### 使用生成器类

```typescript
import { BarcodeGenerator } from '@fuse/barcode'

const generator = new BarcodeGenerator()

// 生成条形码数据
const result = generator.generate({
  type: 'CODE39',
  data: 'HELLO123',
  width: 400,
  height: 120,
  displayText: true,
  fontSize: 14,
})

// 在 Canvas 上绘制
if (result.success && result.barcodeData) {
  generator.drawOnCanvas(ctx, result.barcodeData, 10, 10)
}
```

## 📋 支持的条形码格式

| 格式    | 描述             | 支持字符                 |
| ------- | ---------------- | ------------------------ |
| CODE128 | 高密度线性条形码 | 所有 ASCII 字符          |
| CODE39  | 工业标准条形码   | 数字、大写字母、特殊字符 |
| EAN13   | 国际商品条码     | 12-13 位数字             |

## ⚙️ 配置选项

```typescript
interface BarcodeOptions {
  type: 'CODE128' | 'CODE39' | 'EAN13' // 条形码类型
  data: string // 要编码的数据
  width?: number // 条形码宽度（默认：200）
  height?: number // 条形码高度（默认：100）
  color?: string // 条形码颜色（默认：'#000000'）
  backgroundColor?: string // 背景颜色（默认：'#FFFFFF'）
  displayText?: boolean // 是否显示文本（默认：true）
  fontSize?: number // 文本字体大小（默认：12）
  textColor?: string // 文本颜色（默认：'#000000'）
  margin?: number // 条形码边距（默认：10）
  barWidth?: number // 单个条的宽度（默认：2）
}
```

## 🌍 环境支持

### Web 浏览器

```html
<!-- UMD 版本 -->
<script src="https://unpkg.com/@fuse/barcode/dist/index.umd.js"></script>
<script>
  const result = BarcodeGenerator.generateBarcode('12345', 'CODE128')
  console.log(result.base64)
</script>
```

### UniApp（H5 + 微信小程序）

```vue
<template>
  <view>
    <canvas
      canvas-id="barcode-canvas"
      :style="{ width: '300px', height: '100px' }"
    />
    <image v-if="barcodeImage" :src="barcodeImage" />
  </view>
</template>

<script>
import { generateBarcode, drawBarcodeOnCanvas } from '@fuse/barcode'

export default {
  data() {
    return {
      barcodeImage: '',
    }
  },
  onReady() {
    this.generateBarcodeImage()
    this.drawBarcodeOnCanvas()
  },
  methods: {
    // 生成 base64 图片
    generateBarcodeImage() {
      const result = generateBarcode('Hello UniApp', 'CODE128', {
        width: 300,
        height: 100,
      })

      if (result.success) {
        this.barcodeImage = result.base64
      }
    },

    // 在 Canvas 上绘制
    drawBarcodeOnCanvas() {
      const ctx = uni.createCanvasContext('barcode-canvas', this)

      drawBarcodeOnCanvas(ctx, '123456789', 'CODE39', 0, 0, {
        width: 300,
        height: 100,
      })
    },
  },
}
</script>
```

### React 示例

```tsx
import React, { useEffect, useRef } from 'react'
import { generateBarcode, drawBarcodeOnCanvas } from '@fuse/barcode'

const BarcodeComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [barcodeImage, setBarcodeImage] = useState('')

  useEffect(() => {
    // 生成 base64 图片
    const result = generateBarcode('React Barcode', 'CODE128', {
      width: 300,
      height: 100,
    })

    if (result.success) {
      setBarcodeImage(result.base64 || '')
    }

    // 在 Canvas 上绘制
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')!
      drawBarcodeOnCanvas(ctx, 'CANVAS123', 'CODE39', 0, 0, {
        width: 300,
        height: 100,
      })
    }
  }, [])

  return (
    <div>
      {barcodeImage && <img src={barcodeImage} alt="Barcode" />}
      <canvas ref={canvasRef} width={300} height={100} />
    </div>
  )
}
```

### Vue 3 示例

```vue
<template>
  <div>
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

## 📝 API 文档

### generateBarcode(data, type, options)

快速生成条形码的便捷函数。

**参数：**

- `data: string` - 要编码的数据
- `type: BarcodeType` - 条形码类型（可选，默认 'CODE128'）
- `options: Partial<BarcodeOptions>` - 配置选项（可选）

**返回：** `BarcodeResult`

### drawBarcodeOnCanvas(ctx, data, type, x, y, options)

在 Canvas 上直接绘制条形码。

**参数：**

- `ctx: CanvasContext` - Canvas 上下文
- `data: string` - 要编码的数据
- `type: BarcodeType` - 条形码类型（可选，默认 'CODE128'）
- `x: number` - 绘制起始 X 坐标（可选，默认 0）
- `y: number` - 绘制起始 Y 坐标（可选，默认 0）
- `options: Partial<BarcodeOptions>` - 配置选项（可选）

### BarcodeGenerator 类

#### generate(data | options, type?, options?)

生成条形码数据。

#### generateBase64(data | barcodeData, type?, options?)

生成 base64 图片。

#### drawOnCanvas(ctx, barcodeData, x?, y?)

在 Canvas 上绘制条形码。

## 🔧 开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/barcode.git
cd barcode

# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建
pnpm run build

# 测试
pnpm run test

# 类型检查
pnpm run type-check

# 代码检查
pnpm run lint
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](./LICENSE)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！
