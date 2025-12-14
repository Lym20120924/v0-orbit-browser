// 代理服务配置 - 用于绕过 iframe 限制
export const PROXY_SERVICES = [
  {
    name: "AllOrigins",
    url: (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    type: "cors",
  },
  {
    name: "CorsDev",
    url: (targetUrl: string) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    type: "cors",
  },
]

export function getProxyUrl(url: string, proxyIndex = 0): string {
  const proxy = PROXY_SERVICES[proxyIndex % PROXY_SERVICES.length]
  return proxy.url(url)
}

// 检测网站是否可能阻止 iframe
export function mightBlockIframe(url: string): boolean {
  const blockedDomains = [
    "google.com",
    "facebook.com",
    "twitter.com",
    "x.com",
    "instagram.com",
    "linkedin.com",
    "amazon.com",
    "youtube.com",
    "netflix.com",
    "github.com",
    "stackoverflow.com",
    "reddit.com",
    "twitch.tv",
    "discord.com",
    "slack.com",
    "zoom.us",
    "microsoft.com",
    "apple.com",
    "paypal.com",
    "ebay.com",
  ]

  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return blockedDomains.some((domain) => hostname.includes(domain))
  } catch {
    return false
  }
}

// 生成 Google 缓存 URL
export function getGoogleCacheUrl(url: string): string {
  return `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`
}

// 生成 Archive.org URL
export function getArchiveUrl(url: string): string {
  return `https://web.archive.org/web/${encodeURIComponent(url)}`
}
