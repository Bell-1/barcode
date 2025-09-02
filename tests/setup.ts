// Jest setup file
// Add any global test setup here

/// <reference types="jest" />

// Mock Canvas API for testing
const mockCanvas = {
  getContext: jest.fn(() => ({
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
  })),
  width: 0,
  height: 0,
  toDataURL: jest.fn(() => 'data:image/png;base64,test'),
}

// Mock OffscreenCanvas
global.OffscreenCanvas = jest.fn(() => mockCanvas) as any

// Mock document for Canvas creation
Object.defineProperty(global, 'document', {
  value: {
    createElement: jest.fn(() => mockCanvas),
  },
  writable: true,
})
