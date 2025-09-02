import React, { useState, useEffect, useRef } from 'react'
import {
  generateBarcode,
  drawBarcodeOnCanvas,
  BarcodeType,
} from '@fuse/barcode'
import './App.css'

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [barcodeImage, setBarcodeImage] = useState<string>('')
  const [formData, setFormData] = useState({
    data: 'React Barcode',
    type: 'CODE128' as BarcodeType,
    width: 300,
    height: 120,
    color: '#000000',
    backgroundColor: '#ffffff',
    displayText: true,
  })

  const generateBase64Image = () => {
    try {
      const result = generateBarcode(formData.data, formData.type, {
        width: formData.width,
        height: formData.height,
        color: formData.color,
        backgroundColor: formData.backgroundColor,
        displayText: formData.displayText,
      })

      if (result.success) {
        setBarcodeImage(result.base64 || '')
      } else {
        alert('生成失败: ' + result.error)
      }
    } catch (error) {
      alert('生成失败: ' + (error as Error).message)
    }
  }

  const drawOnCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')!

      // 清除 canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      try {
        drawBarcodeOnCanvas(ctx, formData.data, formData.type, 0, 0, {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
          color: formData.color,
          backgroundColor: formData.backgroundColor,
          displayText: formData.displayText,
        })
      } catch (error) {
        alert('绘制失败: ' + (error as Error).message)
      }
    }
  }

  useEffect(() => {
    generateBase64Image()
    drawOnCanvas()
  }, [formData])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? parseInt(value)
            : value,
    }))
  }

  return (
    <div className="app">
      <h1>@fuse/barcode React 示例</h1>

      <div className="demo-container">
        <div className="form-section">
          <h2>配置选项</h2>

          <div className="form-group">
            <label>条形码内容：</label>
            <input
              type="text"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              placeholder="输入要编码的内容"
            />
          </div>

          <div className="form-group">
            <label>条形码类型：</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="CODE128">CODE128</option>
              <option value="CODE39">CODE39</option>
              <option value="EAN13">EAN13</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>宽度：</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                min="100"
                max="800"
              />
            </div>
            <div className="form-group">
              <label>高度：</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="50"
                max="300"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>条形码颜色：</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>背景颜色：</label>
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="displayText"
                checked={formData.displayText}
                onChange={handleInputChange}
              />
              显示文本
            </label>
          </div>
        </div>

        <div className="results-section">
          <div className="result-group">
            <h3>Base64 图片</h3>
            <div className="result-content">
              {barcodeImage && (
                <img src={barcodeImage} alt="Generated Barcode" />
              )}
            </div>
          </div>

          <div className="result-group">
            <h3>Canvas 绘制</h3>
            <div className="result-content">
              <canvas ref={canvasRef} width={400} height={150} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
