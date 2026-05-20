export interface PerformanceMetrics {
  cpu: number
  memory: number
  memoryUsed: number
  memoryTotal: number
  network: {
    download: number
    upload: number
    latency: number
    connectionType: string
  }
  fps: number
  pageLoadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  timeToInteractive: number
  cumulativeLayoutShift: number
}

export interface ResourceTiming {
  name: string
  type: string
  size: number
  duration: number
  startTime: number
  protocol: string
  cached: boolean
}

export interface PerformanceSnapshot {
  timestamp: number
  metrics: PerformanceMetrics
}

// Real Performance Monitor using Web APIs
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cpu: 0,
    memory: 0,
    memoryUsed: 0,
    memoryTotal: 0,
    network: { download: 0, upload: 0, latency: 0, connectionType: "unknown" },
    fps: 60,
    pageLoadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    timeToInteractive: 0,
    cumulativeLayoutShift: 0,
  }

  private fpsHistory: number[] = []
  private cpuHistory: number[] = []
  private memoryHistory: number[] = []
  private snapshots: PerformanceSnapshot[] = []
  private lastFrameTime = 0
  private frameCount = 0
  private isMonitoring = false
  private animationFrameId: number | null = null
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.lastFrameTime = performance.now()
    }
  }

  startMonitoring() {
    if (this.isMonitoring) return
    this.isMonitoring = true
    
    this.measureFPS()
    this.measureMemory()
    this.measurePageLoad()
    this.measureWebVitals()
    this.measureNetwork()
    
    // Take snapshots every second
    setInterval(() => {
      if (this.isMonitoring) {
        this.snapshots.push({
          timestamp: Date.now(),
          metrics: { ...this.metrics }
        })
        if (this.snapshots.length > 300) this.snapshots.shift() // Keep 5 minutes of data
      }
    }, 1000)
  }

  stopMonitoring() {
    this.isMonitoring = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.observers.forEach(obs => obs.disconnect())
  }

  private measureFPS() {
    const measure = (timestamp: number) => {
      if (!this.isMonitoring) return
      
      this.frameCount++
      const delta = timestamp - this.lastFrameTime

      if (delta >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / delta)
        this.metrics.fps = Math.min(fps, 144) // Cap at 144 FPS
        this.fpsHistory.push(this.metrics.fps)
        if (this.fpsHistory.length > 60) this.fpsHistory.shift()
        this.frameCount = 0
        this.lastFrameTime = timestamp
      }

      this.animationFrameId = requestAnimationFrame(measure)
    }
    this.animationFrameId = requestAnimationFrame(measure)
  }

  private measureMemory() {
    const update = () => {
      if (!this.isMonitoring) return
      
      if ("memory" in performance) {
        const memory = (performance as any).memory
        this.metrics.memoryUsed = memory.usedJSHeapSize
        this.metrics.memoryTotal = memory.jsHeapSizeLimit
        this.metrics.memory = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      }
      
      this.memoryHistory.push(this.metrics.memory)
      if (this.memoryHistory.length > 60) this.memoryHistory.shift()
      
      // Estimate CPU from task duration
      const start = performance.now()
      let sum = 0
      for (let i = 0; i < 100000; i++) sum += Math.random()
      const duration = performance.now() - start
      // Higher duration = higher CPU load estimate
      this.metrics.cpu = Math.min(Math.round(duration * 2), 100)
      this.cpuHistory.push(this.metrics.cpu)
      if (this.cpuHistory.length > 60) this.cpuHistory.shift()
      
      setTimeout(update, 1000)
    }
    update()
  }

  private measurePageLoad() {
    if (typeof window === "undefined") return

    // Use Navigation Timing API Level 2
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    if (navigation) {
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.startTime
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.startTime
      this.metrics.timeToInteractive = navigation.domInteractive - navigation.startTime
    }

    // Get Paint Timing
    const paintEntries = performance.getEntriesByType("paint")
    const fcp = paintEntries.find(entry => entry.name === "first-contentful-paint")
    if (fcp) {
      this.metrics.firstContentfulPaint = fcp.startTime
    }
  }

  private measureWebVitals() {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.largestContentfulPaint = lastEntry.startTime
      })
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
      this.observers.push(lcpObserver)
    } catch (e) {
      // LCP not supported
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.cumulativeLayoutShift = clsValue
          }
        }
      })
      clsObserver.observe({ type: "layout-shift", buffered: true })
      this.observers.push(clsObserver)
    } catch (e) {
      // CLS not supported
    }
  }

  private measureNetwork() {
    if (typeof navigator === "undefined") return

    // Network Information API
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      this.metrics.network.connectionType = connection.effectiveType || "unknown"
      this.metrics.network.latency = connection.rtt || 0
      this.metrics.network.download = (connection.downlink || 0) * 1000 // Convert Mbps to Kbps
    }

    // Measure actual network speed with Resource Timing
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
    if (resources.length > 0) {
      const recent = resources.slice(-10)
      const totalSize = recent.reduce((sum, r) => sum + (r.transferSize || 0), 0)
      const totalDuration = recent.reduce((sum, r) => sum + r.duration, 0)
      if (totalDuration > 0) {
        this.metrics.network.download = Math.round((totalSize / totalDuration) * 1000) // bytes per second
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  getResourceTimings(): ResourceTiming[] {
    if (typeof window === "undefined") return []

    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
    return resources.map(resource => ({
      name: resource.name.split("/").pop() || resource.name,
      type: resource.initiatorType,
      size: resource.transferSize || resource.decodedBodySize || 0,
      duration: Math.round(resource.duration),
      startTime: Math.round(resource.startTime),
      protocol: resource.nextHopProtocol || "unknown",
      cached: resource.transferSize === 0 && resource.decodedBodySize > 0,
    }))
  }

  getFPSHistory(): number[] {
    return [...this.fpsHistory]
  }

  getCPUHistory(): number[] {
    return [...this.cpuHistory]
  }

  getMemoryHistory(): number[] {
    return [...this.memoryHistory]
  }

  getSnapshots(): PerformanceSnapshot[] {
    return [...this.snapshots]
  }

  // Format bytes to human readable
  static formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  // Format duration to human readable
  static formatDuration(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }
}

export const performanceMonitor = new PerformanceMonitor()
