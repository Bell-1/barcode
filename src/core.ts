/**
 * 条形码生成工具
 * 支持多种编码格式，适配uniApp环境（H5和微信小程序）
 * 支持Canvas绘制和base64图片输出
 */

// 微信小程序全局变量类型声明
declare const wx:
  | {
      getSystemInfoSync?: () => any
      createCanvasContext?: (canvasId: string) => any
      [key: string]: any
    }
  | undefined

// uniApp全局变量类型声明
declare const uni:
  | {
      createCanvasContext?: (canvasId: string) => any
      [key: string]: any
    }
  | undefined

// 支持的条形码类型
export type BarcodeType = 'CODE128' | 'CODE39' | 'EAN13'

// 条形码配置选项
export interface BarcodeOptions {
  /** 条形码类型 */
  type: BarcodeType
  /** 要编码的数据 */
  data: string
  /** 条形码宽度 */
  width?: number
  /** 条形码高度 */
  height?: number
  /** 条形码颜色 */
  color?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 是否显示文本 */
  displayText?: boolean
  /** 文本字体大小 */
  fontSize?: number
  /** 文本颜色 */
  textColor?: string
  /** 条形码边距 */
  margin?: number
  /** 单个条的宽度 */
  barWidth?: number
}

// 条形码生成结果
export interface BarcodeResult {
  /** 是否成功 */
  success: boolean
  /** 错误信息 */
  error?: string
  /** base64图片数据 */
  base64?: string
  /** 条形码数据（用于Canvas绘制） */
  barcodeData?: BarcodeData
  /** 编码后的二进制数据数组（兼容性） */
  data?: number[]
  /** 条形码宽度 */
  width?: number
  /** 条形码高度 */
  height?: number
}

// 条形码数据结构
export interface BarcodeData {
  /** 编码后的二进制字符串 */
  encoded: string
  /** 条形码配置 */
  options: Required<BarcodeOptions>
  /** 文本内容 */
  text: string
}

// Canvas上下文类型（兼容H5和小程序）
export type CanvasContext =
  | CanvasRenderingContext2D
  | {
      // 小程序 Canvas 上下文方法
      fillStyle?: string
      font?: string
      textAlign?: string
      textBaseline?: string
      fillRect?: (x: number, y: number, width: number, height: number) => void
      fillText?: (text: string, x: number, y: number) => void
      rect?: (x: number, y: number, width: number, height: number) => void
      fill?: () => void
      draw?: (reserve?: boolean, callback?: () => void) => void
      setFillStyle?: (color: string) => void
      setFontSize?: (size: number) => void
      setTextAlign?: (align: string) => void
      measureText?: (text: string) => {
        actualBoundingBoxAscent?: number
        actualBoundingBoxDescent?: number
        width?: number
      }
      // 添加更多小程序 Canvas 方法兼容
      [key: string]: any
    }

/**
 * Code128编码表
 */
const CODE128_TABLE: Record<number, string> = {
  0: '11011001100',
  1: '11001101100',
  2: '11001100110',
  3: '10010011000',
  4: '10010001100',
  5: '10001001100',
  6: '10011001000',
  7: '10011000100',
  8: '10001100100',
  9: '11001001000',
  10: '11001000100',
  11: '11000100100',
  12: '10110011100',
  13: '10011011100',
  14: '10011001110',
  15: '10111001100',
  16: '10011101100',
  17: '10011100110',
  18: '11001110010',
  19: '11001011100',
  20: '11001001110',
  21: '11011100100',
  22: '11001110100',
  23: '11101101110',
  24: '11101001100',
  25: '11100101100',
  26: '11100100110',
  27: '11101100100',
  28: '11100110100',
  29: '11100110010',
  30: '11011011000',
  31: '11011000110',
  32: '11000110110',
  33: '10100011000',
  34: '10001011000',
  35: '10001000110',
  36: '10110001000',
  37: '10001101000',
  38: '10001100010',
  39: '11010001000',
  40: '11000101000',
  41: '11000100010',
  42: '10110111000',
  43: '10110001110',
  44: '10001101110',
  45: '10111011000',
  46: '10111000110',
  47: '10001110110',
  48: '11101110110',
  49: '11010001110',
  50: '11000101110',
  51: '11011101000',
  52: '11011100010',
  53: '11011101110',
  54: '11101011000',
  55: '11101000110',
  56: '11100010110',
  57: '11101101000',
  58: '11101100010',
  59: '11100011010',
  60: '11101111010',
  61: '11001000010',
  62: '11110001010',
  63: '10100110000',
  64: '10100001100',
  65: '10010110000',
  66: '10010000110',
  67: '10000101100',
  68: '10000100110',
  69: '10110010000',
  70: '10110000100',
  71: '10011010000',
  72: '10011000010',
  73: '10000110100',
  74: '10000110010',
  75: '11000010010',
  76: '11001010000',
  77: '11110111010',
  78: '11000010100',
  79: '10001111010',
  80: '10100111100',
  81: '10010111100',
  82: '10010011110',
  83: '10111100100',
  84: '10011110100',
  85: '10011110010',
  86: '11110100100',
  87: '11110010100',
  88: '11110010010',
  89: '11011011110',
  90: '11011110110',
  91: '11110110110',
  92: '10101111000',
  93: '10100011110',
  94: '10001011110',
  95: '10111101000',
  96: '10111100010',
  97: '11110101000',
  98: '11110100010',
  99: '10111011110',
  100: '10111101110',
  101: '11101011110',
  102: '11110101110',
  103: '11010000100',
  104: '11010010000',
  105: '11010011100',
  106: '1100011101011',
}

/**
 * Code39编码表
 */
const CODE39_TABLE: Record<string, string> = {
  '0': '101001101101',
  '1': '110100101011',
  '2': '101100101011',
  '3': '110110010101',
  '4': '101001101011',
  '5': '110100110101',
  '6': '101100110101',
  '7': '101001011011',
  '8': '110100101101',
  '9': '101100101101',
  A: '110101001011',
  B: '101101001011',
  C: '110110100101',
  D: '101011001011',
  E: '110101100101',
  F: '101101100101',
  G: '101010011011',
  H: '110101001101',
  I: '101101001101',
  J: '101011001101',
  K: '110101010011',
  L: '101101010011',
  M: '110110101001',
  N: '101011010011',
  O: '110101101001',
  P: '101101101001',
  Q: '101010110011',
  R: '110101011001',
  S: '101101011001',
  T: '101011011001',
  U: '110010101011',
  V: '100110101011',
  W: '110011010101',
  X: '100101101011',
  Y: '110010110101',
  Z: '100110110101',
  '-': '100101011011',
  '.': '110010101101',
  ' ': '100110101101',
  $: '100100100101',
  '/': '100100101001',
  '+': '100101001001',
  '%': '101001001001',
  '*': '100101101101',
}

/**
 * EAN13编码表
 */
const EAN13_L_TABLE: Record<string, string> = {
  '0': '0001101',
  '1': '0011001',
  '2': '0010011',
  '3': '0111101',
  '4': '0100011',
  '5': '0110001',
  '6': '0101111',
  '7': '0111011',
  '8': '0110111',
  '9': '0001011',
}

const EAN13_G_TABLE: Record<string, string> = {
  '0': '0100111',
  '1': '0110011',
  '2': '0011011',
  '3': '0100001',
  '4': '0011101',
  '5': '0111001',
  '6': '0000101',
  '7': '0010001',
  '8': '0001001',
  '9': '0010111',
}

const EAN13_R_TABLE: Record<string, string> = {
  '0': '1110010',
  '1': '1100110',
  '2': '1101100',
  '3': '1000010',
  '4': '1011100',
  '5': '1001110',
  '6': '1010000',
  '7': '1000100',
  '8': '1001000',
  '9': '1110100',
}

const EAN13_FIRST_DIGIT_PATTERN: Record<string, string> = {
  '0': 'LLLLLL',
  '1': 'LLGLGG',
  '2': 'LLGGLG',
  '3': 'LLGGGL',
  '4': 'LGLLGG',
  '5': 'LGGLLG',
  '6': 'LGGGLL',
  '7': 'LGLGLG',
  '8': 'LGLGGL',
  '9': 'LGGLGL',
}

/**
 * 条形码生成器类
 */
export class BarcodeGenerator {
  private defaultOptions: Required<BarcodeOptions> = {
    type: 'CODE128',
    data: '',
    width: 200,
    height: 100,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    displayText: true,
    fontSize: 12,
    textColor: '#000000',
    margin: 10,
    barWidth: 2,
  }

  /**
   * 生成条形码
   * @param data 条形码数据或配置选项
   * @param type 条形码类型（当第一个参数为字符串时使用）
   * @param options 额外配置选项
   * @returns 条形码生成结果
   */
  generate(
    data: string | BarcodeOptions,
    type?: BarcodeType,
    options?: Partial<BarcodeOptions>
  ): BarcodeResult {
    // 处理重载参数
    let config: BarcodeOptions
    if (typeof data === 'string') {
      config = {
        ...this.defaultOptions,
        ...options,
        data,
        type: type || 'CODE128',
      }
    } else {
      config = { ...this.defaultOptions, ...data }
    }

    return this.generateInternal({
      ...this.defaultOptions,
      ...config,
    } as Required<BarcodeOptions>)
  }

  /**
   * 内部生成条形码方法
   * @param config 条形码配置
   * @returns 条形码生成结果
   */
  private generateInternal(config: Required<BarcodeOptions>): BarcodeResult {
    try {
      // 验证输入数据
      const validation = this.validateInput(config)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // 根据类型编码数据
      let encoded: string
      let finalText = config.data // 最终显示的文本
      switch (config.type) {
        case 'CODE128':
          encoded = this.encodeCode128(config.data)
          break
        case 'CODE39':
          encoded = this.encodeCode39(config.data)
          break
        case 'EAN13':
          encoded = this.encodeEAN13(config.data)
          // 如果是12位输入，需要更新最终文本包含校验位
          if (config.data.length === 12) {
            finalText = config.data + this.calculateEAN13CheckDigit(config.data)
          }
          break
        default:
          return { success: false, error: `不支持的条形码类型: ${config.type}` }
      }

      const barcodeData: BarcodeData = {
        encoded,
        options: config,
        text: finalText,
      }

      // 生成base64图片
      const base64 = this.generateBase64Internal(barcodeData)

      // 将编码字符串转换为数字数组（兼容性）
      const data = encoded.split('').map((bit) => parseInt(bit, 10))

      return {
        success: true,
        base64,
        barcodeData,
        data,
        width: config.width,
        height: config.height,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : '生成条形码时发生未知错误',
      }
    }
  }

  /**
   * 在Canvas上绘制条形码
   * @param ctx Canvas上下文
   * @param barcodeData 条形码数据
   * @param x 绘制起始X坐标
   * @param y 绘制起始Y坐标
   */
  drawOnCanvas(
    ctx: CanvasContext,
    barcodeData: BarcodeData,
    x: number = 0,
    y: number = 0
  ): void {
    const { encoded, options, text } = barcodeData
    const {
      width,
      height,
      color,
      backgroundColor,
      displayText,
      fontSize,
      textColor,
      margin,
    } = options

    // 清除背景
    this.setFillStyle(ctx, backgroundColor)
    this.fillRect(ctx, x, y, width, height)

    // 计算条形码绘制区域
    const barcodeHeight = displayText
      ? height - fontSize - 10
      : height - margin * 2
    const barcodeY = y + margin
    const availableWidth = width - margin * 2
    const totalBars = encoded.length
    const actualBarWidth = Math.max(1, Math.floor(availableWidth / totalBars))

    // 计算条形码实际宽度并居中
    const actualBarcodeWidth = totalBars * actualBarWidth
    const barcodeStartX = x + margin + (availableWidth - actualBarcodeWidth) / 2

    // 绘制条形码（居中对齐）
    this.setFillStyle(ctx, color)
    let currentX = barcodeStartX

    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] === '1') {
        this.fillRect(ctx, currentX, barcodeY, actualBarWidth, barcodeHeight)
      }
      currentX += actualBarWidth
    }

    // 绘制文本
    if (displayText) {
      this.setFillStyle(ctx, textColor)
      this.setFont(ctx, `${fontSize}px Arial`)
      this.setTextAlign(ctx, 'center')
      const textX = x + width / 2
      const textY = y + height - 5
      this.fillText(ctx, text, textX, textY)
    }

    // 兼容小程序，需要调用draw方法
    if ('draw' in ctx && typeof ctx.draw === 'function') {
      ctx.draw()
    }
  }

  /**
   * 验证输入数据
   */
  private validateInput(options: Required<BarcodeOptions>): {
    valid: boolean
    error?: string
  } {
    const { type, data } = options

    if (!data) {
      return { valid: false, error: '数据不能为空' }
    }

    switch (type) {
      case 'CODE128':
        // CODE128支持ASCII字符
        if (!/^[\x20-\x7E]*$/.test(data)) {
          return { valid: false, error: 'CODE128只支持可打印ASCII字符' }
        }
        break
      case 'CODE39':
        // CODE39支持数字、大写字母和部分特殊字符
        if (!/^[0-9A-Z\-. $/+%*]*$/.test(data)) {
          return {
            valid: false,
            error: 'CODE39只支持数字、大写字母和特定特殊字符',
          }
        }
        break
      case 'EAN13':
        // EAN13必须是12或13位数字
        if (!/^\d{12,13}$/.test(data)) {
          return { valid: false, error: 'EAN13必须是12或13位数字' }
        }
        break
    }

    return { valid: true }
  }

  /**
   * Code128编码
   */
  private encodeCode128(data: string): string {
    let encoded = CODE128_TABLE[104] // Start B
    let checksum = 104

    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i)
      const value = charCode >= 32 ? charCode - 32 : charCode + 64
      encoded += CODE128_TABLE[value]
      checksum += value * (i + 1)
    }

    // 添加校验码
    encoded += CODE128_TABLE[checksum % 103]
    // 添加结束符
    encoded += CODE128_TABLE[106]

    return encoded
  }

  /**
   * Code39编码
   */
  private encodeCode39(data: string): string {
    let encoded = CODE39_TABLE['*'] // 起始符

    for (const char of data) {
      if (CODE39_TABLE[char]) {
        encoded += CODE39_TABLE[char]
      } else {
        throw new Error(`CODE39不支持字符: ${char}`)
      }
    }

    encoded += CODE39_TABLE['*'] // 结束符
    return encoded
  }

  /**
   * EAN13编码
   */
  private encodeEAN13(data: string): string {
    // 如果是12位，计算校验位
    if (data.length === 12) {
      data += this.calculateEAN13CheckDigit(data)
    }

    const firstDigit = data[0]
    const pattern = EAN13_FIRST_DIGIT_PATTERN[firstDigit]

    let encoded = '101' // 起始符

    // 编码左侧6位
    for (let i = 1; i <= 6; i++) {
      const digit = data[i]
      if (pattern[i - 1] === 'L') {
        encoded += EAN13_L_TABLE[digit]
      } else {
        encoded += EAN13_G_TABLE[digit]
      }
    }

    encoded += '01010' // 中间分隔符

    // 编码右侧6位
    for (let i = 7; i <= 12; i++) {
      const digit = data[i]
      encoded += EAN13_R_TABLE[digit]
    }

    encoded += '101' // 结束符
    return encoded
  }

  /**
   * 计算EAN13校验位
   */
  private calculateEAN13CheckDigit(data: string): string {
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(data[i])
      sum += i % 2 === 0 ? digit : digit * 3
    }
    const checkDigit = (10 - (sum % 10)) % 10
    return checkDigit.toString()
  }

  /**
   * 生成base64图片数据
   * @param data 条形码数据或编码字符串
   * @param type 条形码类型（当第一个参数为字符串时使用）
   * @param options 配置选项
   * @returns base64图片数据
   */
  generateBase64(
    data: string | BarcodeData,
    type?: BarcodeType,
    options?: Partial<BarcodeOptions>
  ): string {
    if (typeof data === 'string') {
      // 如果传入的是字符串，先生成条形码数据
      const result = this.generate(data, type, options)
      if (result.success && result.barcodeData) {
        return this.generateBase64Internal(result.barcodeData)
      } else {
        throw new Error(result.error || '生成条形码失败')
      }
    } else {
      // 如果传入的是BarcodeData，直接生成base64
      return this.generateBase64Internal(data)
    }
  }

  /**
   * 内部生成base64图片数据方法
   */
  private generateBase64Internal(barcodeData: BarcodeData): string {
    const { encoded, options } = barcodeData
    const {
      width,
      height,
      color,
      backgroundColor,
      displayText,
      fontSize,
      textColor,
      margin,
    } = options

    // 检查是否在微信小程序环境
    if (this.isWeChatMiniProgram()) {
      // 在微信小程序中，需要使用特殊方式生成base64
      return this.generateBase64ForMiniProgram(barcodeData)
    }

    // 创建离屏Canvas
    const canvas = this.createOffscreenCanvas(width, height)
    if (!canvas) {
      // 如果无法创建Canvas，尝试使用备用方案
      console.warn('无法创建Canvas，尝试使用备用方案生成base64')
      return this.generateBase64Fallback(barcodeData)
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.warn('无法获取Canvas上下文，使用备用方案')
      return this.generateBase64Fallback(barcodeData)
    }

    // 清除背景
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)

    // 计算文字尺寸和布局参数，优化字体大小适应性
    let textMetrics: TextMetrics | null = null
    let actualTextHeight = 0
    let textGap = 0

    if (displayText) {
      // 设置字体以测量文字尺寸
      ctx.font = `${fontSize}px Arial`

      // 测量文字实际尺寸
      try {
        textMetrics = ctx.measureText(barcodeData.text)
        // 计算文字实际高度（包含上升部和下降部）
        actualTextHeight =
          Math.abs(textMetrics.actualBoundingBoxAscent || fontSize * 0.8) +
          Math.abs(textMetrics.actualBoundingBoxDescent || fontSize * 0.2)
      } catch (error) {
        // 如果measureText不支持详细信息，使用字体大小估算
        actualTextHeight = fontSize * 1.2 // 包含行高的估算值
      }

      // 动态计算间距，确保在不同字体大小下都有合适的视觉效果
      textGap = Math.max(6, fontSize * 0.4, actualTextHeight * 0.3)
    }

    // 计算条形码绘制区域，基于实际文字高度和动态间距
    const totalTextArea = displayText ? actualTextHeight + textGap + 4 : 0 // 额外4px作为底部边距
    const barcodeHeight = displayText
      ? height - margin * 2 - totalTextArea
      : height - margin * 2
    const barcodeY = margin
    const availableWidth = width - margin * 2
    const totalBars = encoded.length
    const actualBarWidth = Math.max(1, Math.floor(availableWidth / totalBars))

    // 计算条形码实际宽度并居中
    const actualBarcodeWidth = totalBars * actualBarWidth
    const barcodeStartX = margin + (availableWidth - actualBarcodeWidth) / 2

    // 绘制条形码（居中对齐）
    ctx.fillStyle = color
    let currentX = barcodeStartX

    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] === '1') {
        ctx.fillRect(currentX, barcodeY, actualBarWidth, barcodeHeight)
      }
      currentX += actualBarWidth
    }

    // 绘制文本，优化基线对齐和位置计算
    if (displayText) {
      ctx.fillStyle = textColor
      ctx.font = `${fontSize}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top' // 使用top基线，便于精确控制位置

      const textX = width / 2
      // 文字位置：条码底部 + 动态间距，确保文字完全可见
      const textY = barcodeY + barcodeHeight + textGap

      // 检查文字是否会超出画布边界
      const textBottom = textY + actualTextHeight
      if (textBottom > height - 2) {
        // 如果文字会超出边界，调整位置
        const adjustedTextY = Math.max(textY, height - actualTextHeight - 2)
        ctx.fillText(barcodeData.text, textX, adjustedTextY)
      } else {
        ctx.fillText(barcodeData.text, textX, textY)
      }

      // 重置基线为默认值，避免影响其他绘制
      ctx.textBaseline = 'alphabetic'
    }

    // 转换为base64
    try {
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.warn('生成base64图片失败:', error)
      return this.generateBase64Fallback(barcodeData)
    }
  }

  /**
   * 检查是否在微信小程序环境
   */
  private isWeChatMiniProgram(): boolean {
    try {
      // 检查是否在微信小程序环境
      return typeof wx !== 'undefined' && wx?.getSystemInfoSync !== undefined
    } catch (error) {
      return false
    }
  }

  /**
   * 在微信小程序环境中生成base64
   */
  private generateBase64ForMiniProgram(barcodeData: BarcodeData): string {
    try {
      // 微信小程序中可以使用临时canvas来生成图片
      // 这里使用算法生成一个简单的图片数据，然后转换为base64
      return this.generateBase64WithDrawingAPI(barcodeData)
    } catch (error) {
      console.warn('微信小程序生成base64失败:', error)
      return this.generateBase64Fallback(barcodeData)
    }
  }

  /**
   * 使用绘图API生成base64（兼容各种环境）
   */
  private generateBase64WithDrawingAPI(barcodeData: BarcodeData): string {
    // 尝试使用uni-app的createCanvasContext
    if (typeof uni !== 'undefined' && uni?.createCanvasContext) {
      // 这里可以使用uni-app的canvas API
      // 但需要用户提供canvas元素的id
      console.warn(
        'uni-app环境下需要使用drawOnCanvas方法在页面的canvas上绘制，无法直接生成base64'
      )
      return this.generateBase64Fallback(barcodeData)
    }

    // 其他情况使用备用方案
    return this.generateBase64Fallback(barcodeData)
  }

  /**
   * 备用的base64生成方案（使用算法生成简单的图片数据）
   */
  private generateBase64Fallback(barcodeData: BarcodeData): string {
    try {
      // 直接生成SVG格式的base64，因为SVG可以用文本生成，兼容性最好
      return this.generateSVGBase64(barcodeData)
    } catch (error) {
      console.warn('备用base64生成方案失败:', error)
      // 返回一个透明的像素作为占位符
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    }
  }

  /**
   * 兼容性的base64编码函数
   * 支持浏览器和微信小程序环境
   */
  private encodeBase64(str: string): string {
    // 在浏览器环境中使用btoa
    if (typeof btoa !== 'undefined') {
      return btoa(str)
    }

    // 在小程序环境中使用自实现的base64编码
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let result = ''
    let i = 0

    while (i < str.length) {
      const a = str.charCodeAt(i++)
      const b = i < str.length ? str.charCodeAt(i++) : 0
      const c = i < str.length ? str.charCodeAt(i++) : 0

      const bitmap = (a << 16) | (b << 8) | c

      result += chars.charAt((bitmap >> 18) & 63)
      result += chars.charAt((bitmap >> 12) & 63)
      result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '='
      result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '='
    }

    return result
  }

  /**
   * 生成SVG格式的base64
   */
  private generateSVGBase64(barcodeData: BarcodeData): string {
    const { encoded, options, text } = barcodeData
    const {
      width,
      height,
      color,
      backgroundColor,
      displayText,
      fontSize,
      textColor,
      margin,
    } = options

    // 计算条形码绘制参数
    const textHeight = displayText ? fontSize + 10 : 0
    const barcodeHeight = height - margin * 2 - textHeight
    const availableWidth = width - margin * 2
    const totalBars = encoded.length
    const barWidth = Math.max(0.5, availableWidth / totalBars)

    // 构建SVG内容
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`

    // 背景
    svgContent += `<rect width="${width}" height="${height}" fill="${backgroundColor}"/>`

    // 绘制条形码
    let currentX = margin
    for (let i = 0; i < encoded.length; i++) {
      if (encoded[i] === '1') {
        svgContent += `<rect x="${currentX}" y="${margin}" width="${barWidth}" height="${barcodeHeight}" fill="${color}"/>`
      }
      currentX += barWidth
    }

    // 绘制文本
    if (displayText) {
      const textX = width / 2
      const textY = margin + barcodeHeight + fontSize + 5
      svgContent += `<text x="${textX}" y="${textY}" text-anchor="middle" font-family="Arial" font-size="${fontSize}" fill="${textColor}">${text}</text>`
    }

    svgContent += '</svg>'

    // 转换为base64
    const base64SVG = this.encodeBase64(
      unescape(encodeURIComponent(svgContent))
    )
    return `data:image/svg+xml;base64,${base64SVG}`
  }

  /**
   * 创建离屏Canvas
   */
  private createOffscreenCanvas(
    width: number,
    height: number
  ): HTMLCanvasElement | null {
    try {
      // 检查是否在浏览器环境
      if (typeof document !== 'undefined' && document.createElement) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        return canvas
      }

      // 检查是否支持OffscreenCanvas（现代浏览器）
      if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(
          width,
          height
        ) as unknown as HTMLCanvasElement
      }

      // 在小程序环境中，无法直接创建离屏Canvas
      // 这种情况下返回null，使用占位符
      return null
    } catch (error) {
      console.warn('创建Canvas失败:', error)
      return null
    }
  }

  // Canvas兼容性方法
  private setFillStyle(ctx: CanvasContext, style: string): void {
    if ('fillStyle' in ctx) {
      ctx.fillStyle = style
    } else if ('setFillStyle' in ctx && ctx.setFillStyle) {
      ctx.setFillStyle(style)
    }
  }

  private fillRect(
    ctx: CanvasContext,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    if ('fillRect' in ctx && ctx.fillRect) {
      ctx.fillRect(x, y, width, height)
    } else if ('rect' in ctx && 'fill' in ctx && ctx.rect && ctx.fill) {
      // 小程序Canvas需要先绘制矩形再填充
      ctx.rect(x, y, width, height)
      ctx.fill()
    }
  }

  private setFont(ctx: CanvasContext, font: string): void {
    if ('font' in ctx) {
      ctx.font = font
    } else if ('setFontSize' in ctx && ctx.setFontSize) {
      const fontSize = parseInt(font.match(/\d+/)?.[0] || '12')
      ctx.setFontSize(fontSize)
    }
  }

  private setTextAlign(ctx: CanvasContext, align: string): void {
    if ('textAlign' in ctx) {
      ;(ctx as CanvasRenderingContext2D).textAlign = align as
        | 'left'
        | 'right'
        | 'center'
        | 'start'
        | 'end'
    } else if ('setTextAlign' in ctx && ctx.setTextAlign) {
      ctx.setTextAlign(align)
    }
  }

  private fillText(
    ctx: CanvasContext,
    text: string,
    x: number,
    y: number
  ): void {
    if ('fillText' in ctx && typeof ctx.fillText === 'function') {
      ctx.fillText(text, x, y)
    } else if ('fillText' in ctx && ctx.fillText) {
      // 兼容旧版小程序Canvas API
      ;(ctx as any).fillText(text, x, y)
    }
  }
}

/**
 * 创建条形码生成器实例
 */
export function createBarcodeGenerator(): BarcodeGenerator {
  return new BarcodeGenerator()
}

/**
 * 快速生成条形码（便捷方法）
 * @param data 要编码的数据
 * @param type 条形码类型，默认为CODE128
 * @param options 其他配置选项
 * @returns 条形码生成结果
 */
export function generateBarcode(
  data: string,
  type: BarcodeType = 'CODE128',
  options: Partial<BarcodeOptions> = {}
): BarcodeResult {
  const generator = createBarcodeGenerator()
  return generator.generate({ data, type, ...options })
}

/**
 * 在Canvas上绘制条形码（便捷方法）
 * @param ctx Canvas上下文
 * @param data 要编码的数据
 * @param type 条形码类型，默认为CODE128
 * @param x 绘制起始X坐标
 * @param y 绘制起始Y坐标
 * @param options 其他配置选项
 */
export function drawBarcodeOnCanvas(
  ctx: CanvasContext,
  data: string,
  type: BarcodeType = 'CODE128',
  x: number = 0,
  y: number = 0,
  options: Partial<BarcodeOptions> = {}
): void {
  const generator = createBarcodeGenerator()
  const result = generator.generate({ data, type, ...options })

  if (result.success && result.barcodeData) {
    generator.drawOnCanvas(ctx, result.barcodeData, x, y)
  } else {
    console.error('生成条形码失败:', result.error)
  }
}

// 默认导出
export default {
  BarcodeGenerator,
  createBarcodeGenerator,
  generateBarcode,
  drawBarcodeOnCanvas,
}
