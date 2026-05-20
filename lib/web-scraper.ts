// Real Web Scraper using fetch and DOMParser
export interface ScrapedData {
  url: string
  title: string
  description: string
  images: ScrapedImage[]
  links: ScrapedLink[]
  headings: ScrapedHeading[]
  metadata: Record<string, string>
  text: string
  wordCount: number
  readTime: number
  favicon?: string
  ogImage?: string
  author?: string
  publishDate?: string
  language?: string
}

export interface ScrapedImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface ScrapedLink {
  href: string
  text: string
  isExternal: boolean
}

export interface ScrapedHeading {
  level: number
  text: string
  id?: string
}

export class WebScraper {
  // Use multiple CORS proxies as fallbacks
  private corsProxies = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://api.codetabs.com/v1/proxy?quest="
  ]

  async scrapePage(url: string): Promise<ScrapedData> {
    let html = ""
    let lastError: Error | null = null

    // Try each proxy until one works
    for (const proxy of this.corsProxies) {
      try {
        const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
          headers: {
            "Accept": "text/html,application/xhtml+xml"
          }
        })
        
        if (response.ok) {
          html = await response.text()
          break
        }
      } catch (error) {
        lastError = error as Error
        continue
      }
    }

    if (!html) {
      // Return basic data if all proxies fail
      return this.createEmptyResult(url, lastError?.message)
    }

    return this.parseHTML(url, html)
  }

  private parseHTML(url: string, html: string): ScrapedData {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const baseUrl = new URL(url)

    // Extract title
    const title = doc.querySelector("title")?.textContent?.trim() || 
                  doc.querySelector("h1")?.textContent?.trim() || 
                  "Untitled"

    // Extract description
    const description = doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
                       doc.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
                       this.extractFirstParagraph(doc)

    // Extract images
    const images: ScrapedImage[] = []
    doc.querySelectorAll("img").forEach(img => {
      const src = this.resolveUrl(img.getAttribute("src") || "", baseUrl)
      if (src && !src.includes("data:")) {
        images.push({
          src,
          alt: img.getAttribute("alt") || "",
          width: img.width || undefined,
          height: img.height || undefined
        })
      }
    })

    // Extract links
    const links: ScrapedLink[] = []
    doc.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href") || ""
      if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
        const resolvedUrl = this.resolveUrl(href, baseUrl)
        links.push({
          href: resolvedUrl,
          text: a.textContent?.trim() || href,
          isExternal: !resolvedUrl.includes(baseUrl.hostname)
        })
      }
    })

    // Extract headings
    const headings: ScrapedHeading[] = []
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => {
      const level = parseInt(h.tagName[1])
      headings.push({
        level,
        text: h.textContent?.trim() || "",
        id: h.id || undefined
      })
    })

    // Extract metadata
    const metadata: Record<string, string> = {}
    doc.querySelectorAll("meta").forEach(meta => {
      const name = meta.getAttribute("name") || meta.getAttribute("property")
      const content = meta.getAttribute("content")
      if (name && content) {
        metadata[name] = content
      }
    })

    // Extract text content
    const textContent = this.extractTextContent(doc)
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length
    const readTime = Math.ceil(wordCount / 200) // Average reading speed

    // Extract favicon
    const favicon = doc.querySelector('link[rel="icon"]')?.getAttribute("href") ||
                   doc.querySelector('link[rel="shortcut icon"]')?.getAttribute("href") ||
                   `${baseUrl.origin}/favicon.ico`

    // Extract OG image
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content")

    // Extract author
    const author = doc.querySelector('meta[name="author"]')?.getAttribute("content") ||
                  metadata["article:author"]

    // Extract publish date
    const publishDate = metadata["article:published_time"] ||
                       metadata["datePublished"] ||
                       doc.querySelector("time")?.getAttribute("datetime")

    // Extract language
    const language = doc.documentElement.getAttribute("lang") ||
                    metadata["og:locale"]

    return {
      url,
      title,
      description: description || "",
      images: images.slice(0, 50), // Limit to 50 images
      links: links.slice(0, 100), // Limit to 100 links
      headings,
      metadata,
      text: textContent.slice(0, 10000), // Limit text length
      wordCount,
      readTime,
      favicon: this.resolveUrl(favicon, baseUrl),
      ogImage: ogImage ? this.resolveUrl(ogImage, baseUrl) : undefined,
      author,
      publishDate,
      language
    }
  }

  private extractFirstParagraph(doc: Document): string {
    const paragraphs = doc.querySelectorAll("p")
    for (const p of paragraphs) {
      const text = p.textContent?.trim()
      if (text && text.length > 50) {
        return text.slice(0, 200) + (text.length > 200 ? "..." : "")
      }
    }
    return ""
  }

  private extractTextContent(doc: Document): string {
    // Remove scripts, styles, and other non-content elements
    const clone = doc.body.cloneNode(true) as HTMLElement
    clone.querySelectorAll("script, style, nav, footer, header, aside").forEach(el => el.remove())
    
    return clone.textContent?.replace(/\s+/g, " ").trim() || ""
  }

  private resolveUrl(url: string, baseUrl: URL): string {
    if (!url) return ""
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    if (url.startsWith("//")) return `${baseUrl.protocol}${url}`
    if (url.startsWith("/")) return `${baseUrl.origin}${url}`
    return `${baseUrl.origin}/${url}`
  }

  private createEmptyResult(url: string, error?: string): ScrapedData {
    return {
      url,
      title: error ? `Error: ${error}` : "Unable to scrape page",
      description: "Could not fetch page content. The page may be blocking scraping or CORS requests.",
      images: [],
      links: [],
      headings: [],
      metadata: {},
      text: "",
      wordCount: 0,
      readTime: 0
    }
  }

  // Utility methods for extracting specific data
  extractEmails(text: string): string[] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const matches = text.match(emailRegex) || []
    return [...new Set(matches)] // Remove duplicates
  }

  extractPhones(text: string): string[] {
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?[\d]{3,4}[-.\s]?[\d]{3,4}/g
    const matches = text.match(phoneRegex) || []
    return [...new Set(matches.filter(p => p.replace(/\D/g, "").length >= 7))]
  }

  extractUrls(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g
    const matches = text.match(urlRegex) || []
    return [...new Set(matches)]
  }

  extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u4e00-\u9fff]+/g
    const matches = text.match(hashtagRegex) || []
    return [...new Set(matches)]
  }

  extractMentions(text: string): string[] {
    const mentionRegex = /@[\w]+/g
    const matches = text.match(mentionRegex) || []
    return [...new Set(matches)]
  }

  extractPrices(text: string): string[] {
    const priceRegex = /(?:\$|€|£|¥|￥)[\d,]+(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|EUR|GBP|CNY|JPY)/gi
    const matches = text.match(priceRegex) || []
    return [...new Set(matches)]
  }

  extractDates(text: string): string[] {
    const dateRegex = /\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\w+\s+\d{1,2},?\s+\d{4}/g
    const matches = text.match(dateRegex) || []
    return [...new Set(matches)]
  }

  // Analyze page structure
  analyzeStructure(data: ScrapedData): {
    hasProperHeadings: boolean
    imageAltCoverage: number
    externalLinkRatio: number
    contentLength: "short" | "medium" | "long"
    estimatedType: "article" | "product" | "homepage" | "other"
  } {
    const h1Count = data.headings.filter(h => h.level === 1).length
    const hasProperHeadings = h1Count === 1 && data.headings.length > 1

    const imagesWithAlt = data.images.filter(img => img.alt && img.alt.length > 0).length
    const imageAltCoverage = data.images.length > 0 ? imagesWithAlt / data.images.length : 1

    const externalLinks = data.links.filter(l => l.isExternal).length
    const externalLinkRatio = data.links.length > 0 ? externalLinks / data.links.length : 0

    let contentLength: "short" | "medium" | "long"
    if (data.wordCount < 300) contentLength = "short"
    else if (data.wordCount < 1500) contentLength = "medium"
    else contentLength = "long"

    let estimatedType: "article" | "product" | "homepage" | "other"
    if (data.metadata["og:type"] === "article" || contentLength === "long") {
      estimatedType = "article"
    } else if (data.metadata["og:type"] === "product" || this.extractPrices(data.text).length > 0) {
      estimatedType = "product"
    } else if (data.url.split("/").length <= 4) {
      estimatedType = "homepage"
    } else {
      estimatedType = "other"
    }

    return {
      hasProperHeadings,
      imageAltCoverage,
      externalLinkRatio,
      contentLength,
      estimatedType
    }
  }
}

export const webScraper = new WebScraper()
