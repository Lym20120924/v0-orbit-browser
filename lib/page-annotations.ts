export interface Annotation {
  id: string
  pageUrl: string
  text: string
  position: { x: number; y: number }
  color: string
  timestamp: number
  tags: string[]
}

export class PageAnnotationManager {
  private annotations: Map<string, Annotation[]> = new Map()

  constructor() {
    this.loadAnnotations()
  }

  addAnnotation(
    pageUrl: string,
    text: string,
    position: { x: number; y: number },
    color = "#fbbf24",
    tags: string[] = [],
  ): Annotation {
    const annotation: Annotation = {
      id: Date.now().toString() + Math.random().toString(36),
      pageUrl,
      text,
      position,
      color,
      timestamp: Date.now(),
      tags,
    }

    const pageAnnotations = this.annotations.get(pageUrl) || []
    pageAnnotations.push(annotation)
    this.annotations.set(pageUrl, pageAnnotations)
    this.saveAnnotations()

    return annotation
  }

  getAnnotations(pageUrl: string): Annotation[] {
    return this.annotations.get(pageUrl) || []
  }

  updateAnnotation(id: string, updates: Partial<Annotation>): void {
    for (const [url, annotations] of this.annotations.entries()) {
      const index = annotations.findIndex((a) => a.id === id)
      if (index !== -1) {
        annotations[index] = { ...annotations[index], ...updates }
        this.saveAnnotations()
        break
      }
    }
  }

  deleteAnnotation(id: string): void {
    for (const [url, annotations] of this.annotations.entries()) {
      const filtered = annotations.filter((a) => a.id !== id)
      if (filtered.length !== annotations.length) {
        this.annotations.set(url, filtered)
        this.saveAnnotations()
        break
      }
    }
  }

  searchByTag(tag: string): Annotation[] {
    const results: Annotation[] = []
    for (const annotations of this.annotations.values()) {
      results.push(...annotations.filter((a) => a.tags.includes(tag)))
    }
    return results
  }

  getAllTags(): string[] {
    const tags = new Set<string>()
    for (const annotations of this.annotations.values()) {
      annotations.forEach((a) => a.tags.forEach((t) => tags.add(t)))
    }
    return Array.from(tags)
  }

  private saveAnnotations(): void {
    if (typeof window === "undefined") return
    const data = Array.from(this.annotations.entries())
    localStorage.setItem("orbit_annotations", JSON.stringify(data))
  }

  private loadAnnotations(): void {
    if (typeof window === "undefined") return
    const data = localStorage.getItem("orbit_annotations")
    if (data) {
      const entries = JSON.parse(data)
      this.annotations = new Map(entries)
    }
  }

  exportAnnotations(): string {
    return JSON.stringify(Array.from(this.annotations.entries()), null, 2)
  }

  importAnnotations(jsonData: string): void {
    try {
      const entries = JSON.parse(jsonData)
      this.annotations = new Map(entries)
      this.saveAnnotations()
    } catch (error) {
      console.error("Failed to import annotations:", error)
    }
  }
}
