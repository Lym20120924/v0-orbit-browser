export interface TabPreview {
  tabId: string
  thumbnail: string
  timestamp: number
}

export class TabPreviewManager {
  private previews: Map<string, TabPreview> = new Map()

  async capturePreview(tabId: string, element: HTMLElement): Promise<string> {
    // Simulate screenshot capture
    const thumbnail = "/tab-preview.jpg"

    this.previews.set(tabId, {
      tabId,
      thumbnail,
      timestamp: Date.now(),
    })

    return thumbnail
  }

  getPreview(tabId: string): TabPreview | undefined {
    return this.previews.get(tabId)
  }

  deletePreview(tabId: string): void {
    this.previews.delete(tabId)
  }

  clearOldPreviews(maxAge = 3600000): void {
    const now = Date.now()
    for (const [id, preview] of this.previews.entries()) {
      if (now - preview.timestamp > maxAge) {
        this.previews.delete(id)
      }
    }
  }
}
