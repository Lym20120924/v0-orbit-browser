export interface PerformanceMetrics {
  cpu: number
  memory: number
  network: {
    download: number
    upload: number
  }
  fps: number
  pageLoadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
}

export interface ResourceTiming {
  name: string
  type: string
  size: number
  duration: number
  startTime: number
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cpu: 0,
    memory: 0,
    network: { download: 0, upload: 0 },
    fps: 60,
    pageLoadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
  }

  private fpsHistory: number[] = []
  private lastFrameTime = performance.now()
  private frameCount = 0

  startMonitoring() {
    this.measureFPS()
    this.measureMemory()
    this.measurePageLoad()
  }

  private measureFPS() {
    const measure = () => {
      const now = performance.now()
      const delta = now - this.lastFrameTime
      this.frameCount++

      if (delta >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / delta)
        this.metrics.fps = fps
        this.fpsHistory.push(fps)
        if (this.fpsHistory.length > 60) this.fpsHistory.shift()
        this.frameCount = 0
        this.lastFrameTime = now
      }

      requestAnimationFrame(measure)
    }
    requestAnimationFrame(measure)
  }

  private measureMemory() {
    if ("memory" in performance) {
      const memory = (performance as any).memory
      this.metrics.memory = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
    } else {
      // Simulate memory usage
      this.metrics.memory = Math.floor(Math.random() * 20) + 40
    }
  }

  private measurePageLoad() {
    if (typeof window !== "undefined" && window.performance) {
      const timing = performance.timing
      this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart

      // Try to get First Contentful Paint
      const paint = performance.getEntriesByType("paint")
      const fcp = paint.find((entry) => entry.name === "first-contentful-paint")
      if (fcp) {
        this.metrics.firstContentfulPaint = fcp.startTime
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    this.measureMemory()
    // Simulate CPU and network
    this.metrics.cpu = Math.floor(Math.random() * 30) + 20
    this.metrics.network.download = Math.floor(Math.random() * 5000) + 1000
    this.metrics.network.upload = Math.floor(Math.random() * 1000) + 100
    return { ...this.metrics }
  }

  getResourceTimings(): ResourceTiming[] {
    if (typeof window === "undefined") return []

    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
    return resources.map((resource) => ({
      name: resource.name,
      type: resource.initiatorType,
      size: resource.transferSize || 0,
      duration: resource.duration,
      startTime: resource.startTime,
    }))
  }

  getFPSHistory(): number[] {
    return [...this.fpsHistory]
  }
}

export const performanceMonitor = new PerformanceMonitor()
