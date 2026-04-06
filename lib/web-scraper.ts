export interface ScrapedData {
  title: string
  description: string
  images: string[]
  links: string[]
  headings: string[]
  metadata: Record<string, string>
}

export class WebScraper {
  async scrapePage(url: string): Promise<ScrapedData> {
    // Simulate scraping (in real implementation, would use a backend API)
    return {
      title: "Scraped Page Title",
      description: "Page description extracted from meta tags",
      images: ["/placeholder.svg?height=200&width=200"],
      links: ["https://example.com/link1", "https://example.com/link2"],
      headings: ["Heading 1", "Heading 2", "Heading 3"],
      metadata: {
        author: "John Doe",
        publishDate: new Date().toISOString(),
        keywords: "web, scraping, data",
      },
    }
  }

  extractEmails(text: string): string[] {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g
    return text.match(emailRegex) || []
  }

  extractPhones(text: string): string[] {
    const phoneRegex = /\+?\d{1,3}[-.\s]?$$?\d{1,4}$$?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
    return text.match(phoneRegex) || []
  }
}
