export interface PageAnalysis {
  seo: SEOAnalysis
  accessibility: AccessibilityAnalysis
  performance: PerformanceAnalysis
  timestamp: number
}

export interface SEOAnalysis {
  title: { exists: boolean; length: number; optimal: boolean }
  description: { exists: boolean; length: number; optimal: boolean }
  headings: { h1Count: number; structure: boolean }
  images: { total: number; withAlt: number; percentage: number }
  links: { internal: number; external: number; broken: number }
  keywords: string[]
  score: number
  issues?: { title: string; description: string; severity: "error" | "warning" | "info" }[]
}

export interface AccessibilityAnalysis {
  hasLang: boolean
  contrastIssues: number
  missingAltText: number
  formLabels: { total: number; labeled: number }
  ariaIssues: number
  score: number
  issues?: { title: string; description: string; severity: "error" | "warning" | "info" }[]
}

export interface PerformanceAnalysis {
  loadTime: number
  domSize: number
  imageCount: number
  scriptCount: number
  styleCount: number
  score: number
  metrics?: { name: string; value: string }[]
}

export class PageAnalyzer {
  static analyzeCurrentPage(): PageAnalysis {
    return {
      seo: this.analyzeSEO(),
      accessibility: this.analyzeAccessibility(),
      performance: this.analyzePerformance(),
      timestamp: Date.now(),
    }
  }

  private static analyzeSEO(): SEOAnalysis {
    const title = document.querySelector("title")
    const description = document.querySelector('meta[name="description"]')
    const h1Count = document.querySelectorAll("h1").length
    const images = document.querySelectorAll("img")
    const imagesWithAlt = Array.from(images).filter((img) => img.alt).length

    const titleLength = title?.textContent?.length || 0
    const descLength = description?.getAttribute("content")?.length || 0

    let score = 0
    if (title && titleLength >= 30 && titleLength <= 60) score += 20
    if (description && descLength >= 120 && descLength <= 160) score += 20
    if (h1Count === 1) score += 20
    if (images.length === 0 || imagesWithAlt / images.length > 0.9) score += 20
    score += 20 // Base score

    return {
      title: { exists: !!title, length: titleLength, optimal: titleLength >= 30 && titleLength <= 60 },
      description: { exists: !!description, length: descLength, optimal: descLength >= 120 && descLength <= 160 },
      headings: { h1Count, structure: h1Count === 1 },
      images: {
        total: images.length,
        withAlt: imagesWithAlt,
        percentage: images.length ? (imagesWithAlt / images.length) * 100 : 100,
      },
      links: { internal: 0, external: 0, broken: 0 },
      keywords: [],
      score,
    }
  }

  private static analyzeAccessibility(): AccessibilityAnalysis {
    const hasLang = !!document.documentElement.lang
    const images = document.querySelectorAll("img")
    const missingAltText = Array.from(images).filter((img) => !img.alt).length
    const forms = document.querySelectorAll("input, textarea, select")
    const formsWithLabels = Array.from(forms).filter((input) => {
      const id = input.id
      return id && document.querySelector(`label[for="${id}"]`)
    }).length

    let score = 0
    if (hasLang) score += 20
    if (missingAltText === 0) score += 30
    if (forms.length === 0 || formsWithLabels === forms.length) score += 30
    score += 20

    return {
      hasLang,
      contrastIssues: 0,
      missingAltText,
      formLabels: { total: forms.length, labeled: formsWithLabels },
      ariaIssues: 0,
      score,
    }
  }

  private static analyzePerformance(): PerformanceAnalysis {
    const domSize = document.querySelectorAll("*").length
    const imageCount = document.querySelectorAll("img").length
    const scriptCount = document.querySelectorAll("script").length
    const styleCount = document.querySelectorAll('link[rel="stylesheet"], style').length

    let score = 100
    if (domSize > 1500) score -= 20
    if (imageCount > 50) score -= 20
    if (scriptCount > 20) score -= 20
    if (styleCount > 10) score -= 20

    return {
      loadTime: 0,
      domSize,
      imageCount,
      scriptCount,
      styleCount,
      score: Math.max(0, score),
    }
  }

  static generateReport(analysis: PageAnalysis): string {
    let report = "# Page Analysis Report\n\n"
    report += `Generated: ${new Date(analysis.timestamp).toLocaleString()}\n\n`

    report += `## SEO Score: ${analysis.seo.score}/100\n\n`
    report += `- Title: ${analysis.seo.title.exists ? "✓" : "✗"} (${analysis.seo.title.length} chars)\n`
    report += `- Description: ${analysis.seo.description.exists ? "✓" : "✗"} (${analysis.seo.description.length} chars)\n`
    report += `- H1 Tags: ${analysis.seo.headings.h1Count}\n`
    report += `- Images with Alt: ${analysis.seo.images.withAlt}/${analysis.seo.images.total}\n\n`

    report += `## Accessibility Score: ${analysis.accessibility.score}/100\n\n`
    report += `- Lang Attribute: ${analysis.accessibility.hasLang ? "✓" : "✗"}\n`
    report += `- Missing Alt Text: ${analysis.accessibility.missingAltText}\n`
    report += `- Form Labels: ${analysis.accessibility.formLabels.labeled}/${analysis.accessibility.formLabels.total}\n\n`

    report += `## Performance Score: ${analysis.performance.score}/100\n\n`
    report += `- DOM Size: ${analysis.performance.domSize} elements\n`
    report += `- Images: ${analysis.performance.imageCount}\n`
    report += `- Scripts: ${analysis.performance.scriptCount}\n`
    report += `- Stylesheets: ${analysis.performance.styleCount}\n`

    return report
  }
}

export function analyzePage(url: string): PageAnalysis {
  // Simulate page analysis since we can't actually analyze external pages
  const mockSEOScore = 70 + Math.floor(Math.random() * 30)
  const mockAccessibilityScore = 65 + Math.floor(Math.random() * 35)
  const mockPerformanceScore = 60 + Math.floor(Math.random() * 40)

  return {
    seo: {
      title: { exists: true, length: 45, optimal: true },
      description: { exists: true, length: 140, optimal: true },
      headings: { h1Count: 1, structure: true },
      images: { total: 15, withAlt: 13, percentage: 86.7 },
      links: { internal: 25, external: 8, broken: 0 },
      keywords: ["web", "development", "technology"],
      score: mockSEOScore,
      issues: [
        {
          title: "Missing meta description",
          description: "Add a meta description to improve SEO",
          severity: "warning" as const,
        },
        {
          title: "Title too short",
          description: "Page title should be between 30-60 characters",
          severity: "error" as const,
        },
        {
          title: "Good heading structure",
          description: "Page has a proper H1 tag and heading hierarchy",
          severity: "info" as const,
        },
      ],
    },
    accessibility: {
      hasLang: true,
      contrastIssues: 2,
      missingAltText: 2,
      formLabels: { total: 10, labeled: 9 },
      ariaIssues: 1,
      score: mockAccessibilityScore,
      issues: [
        {
          title: "Missing alt attributes",
          description: "2 images are missing alt text for screen readers",
          severity: "error" as const,
        },
        {
          title: "Low contrast text",
          description: "Some text has insufficient color contrast",
          severity: "warning" as const,
        },
        {
          title: "Form label missing",
          description: "1 form input is missing an associated label",
          severity: "error" as const,
        },
      ],
    },
    performance: {
      loadTime: 1.2 + Math.random(),
      domSize: 850 + Math.floor(Math.random() * 300),
      imageCount: 15,
      scriptCount: 8,
      styleCount: 4,
      score: mockPerformanceScore,
      metrics: [
        { name: "First Contentful Paint", value: "1.2s" },
        { name: "Time to Interactive", value: "2.8s" },
        { name: "Speed Index", value: "3.1s" },
        { name: "Total Blocking Time", value: "180ms" },
      ],
    },
    timestamp: Date.now(),
  }
}
