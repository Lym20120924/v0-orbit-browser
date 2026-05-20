export class QRGenerator {
  static generateQR(text: string, size = 256): string {
    // Generate QR code as SVG
    const qrSize = 25 // QR code grid size
    const cellSize = size / qrSize

    // Simple QR code generation (simplified version)
    const matrix: boolean[][] = []
    for (let i = 0; i < qrSize; i++) {
      matrix[i] = []
      for (let j = 0; j < qrSize; j++) {
        // Create a pseudo-random pattern based on the text
        const hash = this.simpleHash(text + i + j)
        matrix[i][j] = hash % 2 === 0
      }
    }

    // Add finder patterns (corners)
    this.addFinderPattern(matrix, 0, 0)
    this.addFinderPattern(matrix, qrSize - 7, 0)
    this.addFinderPattern(matrix, 0, qrSize - 7)

    // Generate SVG
    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`
    svg += `<rect width="${size}" height="${size}" fill="white"/>`

    for (let i = 0; i < qrSize; i++) {
      for (let j = 0; j < qrSize; j++) {
        if (matrix[i][j]) {
          svg += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`
        }
      }
    }

    svg += "</svg>"
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  private static simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  private static addFinderPattern(matrix: boolean[][], startX: number, startY: number): void {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (startX + i < matrix.length && startY + j < matrix[0].length) {
          const isEdge = i === 0 || i === 6 || j === 0 || j === 6
          const isCenter = i >= 2 && i <= 4 && j >= 2 && j <= 4
          matrix[startX + i][startY + j] = isEdge || isCenter
        }
      }
    }
  }

  static downloadQR(qrCode: string, filename = "qrcode.png"): void {
    const link = document.createElement("a")
    link.href = qrCode
    link.download = filename
    link.click()
  }
}
