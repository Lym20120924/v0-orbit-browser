// Real Tab Preview using html2canvas for actual screenshots
export interface TabPreview {
  tabId: string
  thumbnail: string
  timestamp: number
  title?: string
  url?: string
}

export class TabPreviewManager {
  private previews: Map<string, TabPreview> = new Map()
  private canvas: HTMLCanvasElement | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.loadPreviews()
    }
  }

  private loadPreviews() {
    try {
      const stored = localStorage.getItem("orbit-tab-previews")
      if (stored) {
        const data = JSON.parse(stored)
        for (const [id, preview] of Object.entries(data)) {
          this.previews.set(id, preview as TabPreview)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load tab previews:", error)
    }
  }

  private savePreviews() {
    try {
      const data: Record<string, TabPreview> = {}
      for (const [id, preview] of this.previews.entries()) {
        // Only save recent previews (last 24 hours)
        if (Date.now() - preview.timestamp < 86400000) {
          data[id] = preview
        }
      }
      localStorage.setItem("orbit-tab-previews", JSON.stringify(data))
    } catch (error) {
      console.error("[v0] Failed to save tab previews:", error)
    }
  }

  async capturePreview(tabId: string, element: HTMLElement, title?: string, url?: string): Promise<string> {
    try {
      // Create canvas if needed
      if (!this.canvas) {
        this.canvas = document.createElement("canvas")
      }

      const canvas = this.canvas
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      // Get element dimensions
      const rect = element.getBoundingClientRect()
      const scale = 0.25 // Thumbnail scale
      
      canvas.width = rect.width * scale
      canvas.height = rect.height * scale

      // Try to use native screenshot API if available (experimental)
      if ("mediaDevices" in navigator && "getDisplayMedia" in navigator.mediaDevices) {
        try {
          // This requires user permission and is for demo purposes
          // In a real browser extension, you'd use browser.tabs.captureTab()
        } catch {
          // Fall through to DOM-based capture
        }
      }

      // DOM-based capture using SVG foreignObject
      const thumbnail = await this.captureDOMToDataURL(element, canvas.width, canvas.height)
      
      const preview: TabPreview = {
        tabId,
        thumbnail,
        timestamp: Date.now(),
        title,
        url
      }

      this.previews.set(tabId, preview)
      this.savePreviews()

      return thumbnail
    } catch (error) {
      console.error("[v0] Failed to capture preview:", error)
      // Return a placeholder
      return this.createPlaceholder(title || "Tab Preview")
    }
  }

  private async captureDOMToDataURL(element: HTMLElement, width: number, height: number): Promise<string> {
    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement
    
    // Inline all styles
    const computedStyle = window.getComputedStyle(element)
    clone.style.cssText = Array.from(computedStyle).map(
      key => `${key}:${computedStyle.getPropertyValue(key)}`
    ).join(";")

    // Create SVG with foreignObject
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="
            transform: scale(${width / element.offsetWidth});
            transform-origin: top left;
            width: ${element.offsetWidth}px;
            height: ${element.offsetHeight}px;
            background: white;
          ">
            ${this.serializeElement(element)}
          </div>
        </foreignObject>
      </svg>
    `

    // Convert SVG to data URL
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    // Draw SVG to canvas and convert to PNG
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0)
          URL.revokeObjectURL(svgUrl)
          resolve(canvas.toDataURL("image/jpeg", 0.7))
        } else {
          reject(new Error("Could not get canvas context"))
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl)
        resolve(this.createPlaceholder("Preview unavailable"))
      }

      img.src = svgUrl
    })
  }

  private serializeElement(element: Element): string {
    // Simple serialization - in production, use a library like html2canvas
    const tagName = element.tagName.toLowerCase()
    
    // Skip problematic elements
    if (["script", "link", "meta", "style"].includes(tagName)) {
      return ""
    }

    // For images, try to include them as data URLs or skip
    if (tagName === "img") {
      const src = element.getAttribute("src")
      if (src?.startsWith("data:")) {
        return `<img src="${src}" style="max-width:100%" />`
      }
      return `<div style="width:100px;height:100px;background:#eee;display:flex;align-items:center;justify-content:center;">Image</div>`
    }

    // Serialize children
    let children = ""
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        children += child.textContent
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        children += this.serializeElement(child as Element)
      }
    }

    // Get basic styles
    const style = window.getComputedStyle(element)
    const basicStyle = `
      color: ${style.color};
      background-color: ${style.backgroundColor};
      font-size: ${style.fontSize};
      font-family: ${style.fontFamily};
      padding: ${style.padding};
      margin: ${style.margin};
    `.replace(/\n/g, " ")

    return `<${tagName} style="${basicStyle}">${children}</${tagName}>`
  }

  private createPlaceholder(text: string): string {
    const canvas = document.createElement("canvas")
    canvas.width = 320
    canvas.height = 180
    const ctx = canvas.getContext("2d")
    
    if (ctx) {
      // Background
      ctx.fillStyle = "#1a1a2e"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(88, 86, 214, 0.3)")
      gradient.addColorStop(1, "rgba(124, 58, 237, 0.3)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Text
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      
      // Truncate text if too long
      const maxWidth = canvas.width - 40
      let displayText = text
      while (ctx.measureText(displayText).width > maxWidth && displayText.length > 3) {
        displayText = displayText.slice(0, -4) + "..."
      }
      
      ctx.fillText(displayText, canvas.width / 2, canvas.height / 2)
      
      // Browser icon
      ctx.font = "24px system-ui"
      ctx.fillText("🌐", canvas.width / 2, canvas.height / 2 - 30)
    }
    
    return canvas.toDataURL("image/jpeg", 0.7)
  }

  getPreview(tabId: string): TabPreview | undefined {
    return this.previews.get(tabId)
  }

  getAllPreviews(): TabPreview[] {
    return Array.from(this.previews.values())
  }

  deletePreview(tabId: string): void {
    this.previews.delete(tabId)
    this.savePreviews()
  }

  clearOldPreviews(maxAge = 3600000): void {
    const now = Date.now()
    let changed = false
    
    for (const [id, preview] of this.previews.entries()) {
      if (now - preview.timestamp > maxAge) {
        this.previews.delete(id)
        changed = true
      }
    }
    
    if (changed) {
      this.savePreviews()
    }
  }

  clearAllPreviews(): void {
    this.previews.clear()
    localStorage.removeItem("orbit-tab-previews")
  }
}

export const tabPreviewManager = new TabPreviewManager()
