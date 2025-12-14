// 代理服务配置 - 用于绕过 iframe 限制
export const PROXY_SERVICES = [
  {
    name: "AllOrigins",
    url: (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    type: "cors",
  },
  {
    name: "CorsProxy.io",
    url: (targetUrl: string) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    type: "cors",
  },
  {
    name: "ThingProxy",
    url: (targetUrl: string) => `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
    type: "cors",
  },
  {
    name: "CorsAnywhere",
    url: (targetUrl: string) => `https://cors-anywhere.herokuapp.com/${targetUrl}`,
    type: "cors",
  },
  {
    name: "Google Cache",
    url: (targetUrl: string) =>
      `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(targetUrl)}`,
    type: "cache",
  },
  {
    name: "Archive.org",
    url: (targetUrl: string) => `https://web.archive.org/web/${targetUrl}`,
    type: "archive",
  },
]

export function getProxyUrl(url: string, proxyIndex = 0): string {
  const proxy = PROXY_SERVICES[proxyIndex % PROXY_SERVICES.length]
  return proxy.url(url)
}

export function getProxyName(proxyIndex = 0): string {
  const proxy = PROXY_SERVICES[proxyIndex % PROXY_SERVICES.length]
  return proxy.name
}

export function getTotalProxies(): number {
  return PROXY_SERVICES.length
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
    "baidu.com",
    "taobao.com",
    "tmall.com",
    "jd.com",
    "weibo.com",
    "qq.com",
    "alipay.com",
    "pinterest.com",
    "tiktok.com",
    "snapchat.com",
    "whatsapp.com",
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
  return `https://web.archive.org/web/${url}`
}

// 检测 URL 是否可访问
export async function checkUrlAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" })
    return true
  } catch {
    return false
  }
}
