import {
  generateBarcode,
  BarcodeGenerator,
  drawBarcodeOnCanvas,
} from '../src/index'

describe('BarcodeGenerator', () => {
  let generator: BarcodeGenerator

  beforeEach(() => {
    generator = new BarcodeGenerator()
  })

  describe('generateBarcode function', () => {
    it('should generate CODE128 barcode successfully', () => {
      const result = generateBarcode('Hello World', 'CODE128')

      expect(result.success).toBe(true)
      expect(result.barcodeData).toBeDefined()
      expect(result.barcodeData?.encoded).toBeDefined()
      expect(result.barcodeData?.text).toBe('Hello World')
    })

    it('should generate CODE39 barcode successfully', () => {
      const result = generateBarcode('HELLO123', 'CODE39')

      expect(result.success).toBe(true)
      expect(result.barcodeData).toBeDefined()
      expect(result.barcodeData?.text).toBe('HELLO123')
    })

    it('should generate EAN13 barcode successfully', () => {
      const result = generateBarcode('123456789012', 'EAN13')

      expect(result.success).toBe(true)
      expect(result.barcodeData).toBeDefined()
      expect(result.barcodeData?.text).toBe('1234567890128') // 包含校验位
    })

    it('should handle invalid data gracefully', () => {
      const result = generateBarcode('', 'CODE128')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should validate CODE39 input', () => {
      const result = generateBarcode('hello', 'CODE39') // 小写字母不支持

      expect(result.success).toBe(false)
      expect(result.error).toContain('CODE39只支持')
    })

    it('should validate EAN13 input', () => {
      const result = generateBarcode('12345', 'EAN13') // 位数不够

      expect(result.success).toBe(false)
      expect(result.error).toContain('EAN13必须是')
    })
  })

  describe('BarcodeGenerator class', () => {
    it('should generate barcode with custom options', () => {
      const result = generator.generate({
        type: 'CODE128',
        data: 'Test Data',
        width: 300,
        height: 150,
        color: '#FF0000',
        backgroundColor: '#00FF00',
        displayText: false,
      })

      expect(result.success).toBe(true)
      expect(result.width).toBe(300)
      expect(result.height).toBe(150)
      expect(result.barcodeData?.options.color).toBe('#FF0000')
      expect(result.barcodeData?.options.backgroundColor).toBe('#00FF00')
      expect(result.barcodeData?.options.displayText).toBe(false)
    })

    it('should generate base64 image', () => {
      const result = generator.generate('Test123', 'CODE128')

      expect(result.success).toBe(true)
      expect(result.base64).toBeDefined()
      expect(result.base64).toContain('data:image/')
    })

    it('should calculate EAN13 check digit correctly', () => {
      const result = generator.generate('123456789012', 'EAN13')

      expect(result.success).toBe(true)
      expect(result.barcodeData?.text).toBe('1234567890128') // 校验位应该是8
    })
  })

  describe('Canvas drawing', () => {
    let mockCanvas: any
    let mockContext: any

    beforeEach(() => {
      mockContext = {
        fillStyle: '',
        font: '',
        textAlign: '',
        textBaseline: '',
        fillRect: jest.fn(),
        fillText: jest.fn(),
        measureText: jest.fn(() => ({
          actualBoundingBoxAscent: 10,
          actualBoundingBoxDescent: 2,
        })),
      }

      mockCanvas = {
        getContext: jest.fn(() => mockContext),
        width: 300,
        height: 100,
        toDataURL: jest.fn(() => 'data:image/png;base64,test'),
      }

      // Mock document.createElement for Canvas creation
      global.document = {
        createElement: jest.fn(() => mockCanvas),
      } as any
    })

    it('should draw barcode on canvas', () => {
      const result = generator.generate('TEST123', 'CODE128')

      expect(result.success).toBe(true)

      if (result.barcodeData) {
        generator.drawOnCanvas(mockContext, result.barcodeData, 0, 0)
        expect(mockContext.fillRect).toHaveBeenCalled()
      }
    })

    it('should draw barcode using convenience function', () => {
      drawBarcodeOnCanvas(mockContext, 'TEST456', 'CODE39', 10, 20, {
        width: 250,
        height: 80,
      })

      expect(mockContext.fillRect).toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('should handle unsupported barcode type', () => {
      const result = generator.generate({
        type: 'INVALID_TYPE' as any,
        data: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('不支持的条形码类型')
    })

    it('should handle CODE39 unsupported characters', () => {
      const result = generator.generate('hello@world', 'CODE39')

      expect(result.success).toBe(false)
      expect(result.error).toContain('CODE39只支持')
    })
  })
})
