// Screenshot utilities
export async function captureScreenshot(element?: HTMLElement): Promise<string> {
  // 模拟截图 - 实际应用中使用 html2canvas 或类似库
  return new Promise((resolve) => {
    setTimeout(() => {
      // 返回模拟的 base64 图片数据
      resolve(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      )
    }, 500)
  })
}

export function downloadScreenshot(dataUrl: string, filename: string) {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = filename
  link.click()
}
