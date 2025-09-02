/**
 * @fuse/barcode - 现代化条形码生成器
 *
 * 支持多种条形码格式，兼容 Web、H5 和微信小程序环境
 * 提供 Canvas 绘制和 base64 图片输出功能
 *
 * @author Your Name
 * @license MIT
 */

// 导出所有类型定义
export type {
  BarcodeType,
  BarcodeOptions,
  BarcodeResult,
  BarcodeData,
  CanvasContext,
} from './core'

// 导出主要类和函数
export {
  BarcodeGenerator,
  createBarcodeGenerator,
  generateBarcode,
  drawBarcodeOnCanvas,
} from './core'

// 版本信息
export const version = '1.0.0'

// 默认导出
export { default } from './core'
