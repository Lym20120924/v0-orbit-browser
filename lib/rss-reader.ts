export interface RSSFeed {
  id: string
  url: string
  title: string
  description: string
  lastUpdated: number
  favicon?: string
  category: string
}

export interface RSSItem {
  id: string
  feedId: string
  title: string
  link: string
  description: string
  pubDate: number
  author?: string
  content?: string
  image?: string
  read: boolean
  starred: boolean
}

export class RSSReader {
  private feeds: Map<string, RSSFeed> = new Map()
  private items: Map<string, RSSItem[]> = new Map()

  constructor() {
    this.loadData()
  }

  async addFeed(url: string, category = "General"): Promise<RSSFeed> {
    try {
      // Parse RSS feed
      const feed = await this.fetchAndParseFeed(url)
      feed.category = category

      this.feeds.set(feed.id, feed)
      this.saveData()

      return feed
    } catch (error) {
      throw new Error("Failed to add RSS feed")
    }
  }

  private async fetchAndParseFeed(url: string): Promise<RSSFeed> {
    // Simulate RSS feed fetching (in real implementation, would use RSS parser)
    const feedId = Date.now().toString() + Math.random().toString(36)

    const feed: RSSFeed = {
      id: feedId,
      url,
      title: "Sample Feed",
      description: "Feed description",
      lastUpdated: Date.now(),
      category: "General",
    }

    // Generate sample items
    const items: RSSItem[] = []
    for (let i = 0; i < 10; i++) {
      items.push({
        id: `${feedId}-${i}`,
        feedId,
        title: `Article ${i + 1}`,
        link: `${url}/article-${i}`,
        description: `Description for article ${i + 1}`,
        pubDate: Date.now() - i * 3600000,
        read: false,
        starred: false,
      })
    }

    this.items.set(feedId, items)
    return feed
  }

  getFeeds(category?: string): RSSFeed[] {
    const feeds = Array.from(this.feeds.values())
    if (category) {
      return feeds.filter((f) => f.category === category)
    }
    return feeds
  }

  getItems(feedId?: string, unreadOnly = false): RSSItem[] {
    if (feedId) {
      const items = this.items.get(feedId) || []
      return unreadOnly ? items.filter((i) => !i.read) : items
    }

    const allItems: RSSItem[] = []
    for (const items of this.items.values()) {
      allItems.push(...items)
    }

    return unreadOnly ? allItems.filter((i) => !i.read) : allItems
  }

  markAsRead(itemId: string): void {
    for (const items of this.items.values()) {
      const item = items.find((i) => i.id === itemId)
      if (item) {
        item.read = true
        this.saveData()
        break
      }
    }
  }

  toggleStar(itemId: string): void {
    for (const items of this.items.values()) {
      const item = items.find((i) => i.id === itemId)
      if (item) {
        item.starred = !item.starred
        this.saveData()
        break
      }
    }
  }

  deleteFeed(feedId: string): void {
    this.feeds.delete(feedId)
    this.items.delete(feedId)
    this.saveData()
  }

  getCategories(): string[] {
    const categories = new Set<string>()
    for (const feed of this.feeds.values()) {
      categories.add(feed.category)
    }
    return Array.from(categories)
  }

  private saveData(): void {
    localStorage.setItem("orbit_rss_feeds", JSON.stringify(Array.from(this.feeds.entries())))
    localStorage.setItem("orbit_rss_items", JSON.stringify(Array.from(this.items.entries())))
  }

  private loadData(): void {
    const feedsData = localStorage.getItem("orbit_rss_feeds")
    const itemsData = localStorage.getItem("orbit_rss_items")

    if (feedsData) {
      this.feeds = new Map(JSON.parse(feedsData))
    }
    if (itemsData) {
      this.items = new Map(JSON.parse(itemsData))
    }
  }
}
