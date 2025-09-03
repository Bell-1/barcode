<template>
  <view class="container">
    <view class="header">
      <text class="title">@innel/barcode UniApp 示例</text>
    </view>

    <!-- 配置表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label">条形码内容：</text>
        <input
          v-model="formData.data"
          placeholder="输入要编码的内容"
          class="input"
        />
      </view>

      <view class="form-item">
        <text class="label">条形码类型：</text>
        <picker
          :value="typeIndex"
          :range="typeOptions"
          @change="onTypeChange"
          class="picker"
        >
          <view class="picker-content">{{ typeOptions[typeIndex] }}</view>
        </picker>
      </view>

      <view class="form-row">
        <view class="form-item">
          <text class="label">宽度：</text>
          <input v-model.number="formData.width" type="number" class="input" />
        </view>
        <view class="form-item">
          <text class="label">高度：</text>
          <input v-model.number="formData.height" type="number" class="input" />
        </view>
      </view>

      <view class="form-item">
        <switch :checked="formData.displayText" @change="onDisplayTextChange" />
        <text class="switch-label">显示文本</text>
      </view>

      <button @click="generateBarcode" class="generate-btn">生成条形码</button>
    </view>

    <!-- Base64 图片显示 -->
    <view class="result-section" v-if="barcodeImage">
      <text class="section-title">Base64 图片：</text>
      <image :src="barcodeImage" mode="widthFix" class="barcode-image" />
    </view>

    <!-- Canvas 绘制 -->
    <view class="result-section">
      <text class="section-title">Canvas 绘制：</text>
      <canvas
        canvas-id="barcodeCanvas"
        class="barcode-canvas"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      />
      <button @click="drawOnCanvas" class="draw-btn">在 Canvas 上绘制</button>
    </view>

    <!-- 错误信息 -->
    <view v-if="errorMessage" class="error-message">
      <text>{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script>
import { generateBarcode, drawBarcodeOnCanvas } from '@innel/barcode'

export default {
  data() {
    return {
      formData: {
        data: 'UniApp Example',
        type: 'CODE128',
        width: 300,
        height: 120,
        displayText: true,
      },
      typeOptions: ['CODE128', 'CODE39', 'EAN13'],
      typeIndex: 0,
      barcodeImage: '',
      canvasWidth: 300,
      canvasHeight: 120,
      errorMessage: '',
    }
  },

  onReady() {
    this.generateBarcode()
    this.drawOnCanvas()
  },

  methods: {
    onTypeChange(e) {
      this.typeIndex = e.detail.value
      this.formData.type = this.typeOptions[this.typeIndex]
    },

    onDisplayTextChange(e) {
      this.formData.displayText = e.detail.value
    },

    generateBarcode() {
      this.errorMessage = ''

      try {
        const result = generateBarcode(this.formData.data, this.formData.type, {
          width: this.formData.width,
          height: this.formData.height,
          displayText: this.formData.displayText,
        })

        if (result.success) {
          this.barcodeImage = result.base64 || ''
        } else {
          this.errorMessage = '生成失败: ' + result.error
        }
      } catch (error) {
        this.errorMessage = '生成失败: ' + error.message
      }
    },

    drawOnCanvas() {
      this.errorMessage = ''

      try {
        const ctx = uni.createCanvasContext('barcodeCanvas', this)

        // 清除画布
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        drawBarcodeOnCanvas(ctx, this.formData.data, this.formData.type, 0, 0, {
          width: this.canvasWidth,
          height: this.canvasHeight,
          displayText: this.formData.displayText,
        })

        // 小程序需要调用 draw 方法
        ctx.draw()
      } catch (error) {
        this.errorMessage = '绘制失败: ' + error.message
      }
    },
  },
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2c3e50;
}

.form-section {
  background: white;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
}

.form-row {
  display: flex;
  gap: 20rpx;
}

.form-row .form-item {
  flex: 1;
}

.label {
  width: 160rpx;
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}

.input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e1e5e9;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.picker {
  flex: 1;
}

.picker-content {
  height: 70rpx;
  line-height: 70rpx;
  padding: 0 20rpx;
  border: 2rpx solid #e1e5e9;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: white;
}

.switch-label {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.generate-btn,
.draw-btn {
  width: 100%;
  height: 80rpx;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 20rpx;
}

.generate-btn:hover,
.draw-btn:hover {
  background: #0056b3;
}

.result-section {
  background: white;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20rpx;
  display: block;
}

.barcode-image {
  width: 100%;
  border: 2rpx solid #e1e5e9;
  border-radius: 8rpx;
}

.barcode-canvas {
  border: 2rpx solid #e1e5e9;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 20rpx;
  border-radius: 8rpx;
  border: 2rpx solid #f5c6cb;
  margin-top: 20rpx;
}
</style>
