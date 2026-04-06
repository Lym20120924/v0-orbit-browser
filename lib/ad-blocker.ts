export interface AdBlockRule {
  id: string
  pattern: string
  type: "url" | "selector" | "domain"
  action: "block" | "hide"
}

export interface BlockedAd {
  id: string
  url: string
  type: string
  timestamp: Date
  domain: string
}

const DEFAULT_AD_PATTERNS = [
  // URL patterns
  { id: "1", pattern: "/ads/", type: "url" as const, action: "block" as const },
  { id: "2", pattern: "/banner", type: "url" as const, action: "block" as const },
  { id: "3", pattern: "doubleclick.net", type: "domain" as const, action: "block" as const },
  { id: "4", pattern: "googlesyndication.com", type: "domain" as const, action: "block" as const },
  { id: "5", pattern: "adservice", type: "url" as const, action: "block" as const },
  { id: "6", pattern: "analytics", type: "url" as const, action: "block" as const },
  { id: "7", pattern: "facebook.com/tr", type: "url" as const, action: "block" as const },

  // CSS selectors
  { id: "8", pattern: ".ad", type: "selector" as const, action: "hide" as const },
  { id: "9", pattern: ".advertisement", type: "selector" as const, action: "hide" as const },
  { id: "10", pattern: "[class*='ad-']", type: "selector" as const, action: "hide" as const },
  { id: "11", pattern: "#ad", type: "selector" as const, action: "hide" as const },
  { id: "12", pattern: ".sponsored", type: "selector" as const, action: "hide" as const },
]

export function getAdBlockRules(): AdBlockRule[] {
  if (typeof window === "undefined") return DEFAULT_AD_PATTERNS
  const saved = localStorage.getItem("orbit_adblock_rules")
  return saved ? JSON.parse(saved) : DEFAULT_AD_PATTERNS
}

export function saveAdBlockRules(rules: AdBlockRule[]) {
  localStorage.setItem("orbit_adblock_rules", JSON.stringify(rules))
}

export function shouldBlockUrl(url: string): boolean {
  const rules = getAdBlockRules()
  return rules.some((rule) => {
    if (rule.type === "url" && rule.action === "block") {
      return url.includes(rule.pattern)
    }
    if (rule.type === "domain" && rule.action === "block") {
      try {
        const hostname = new URL(url).hostname
        return hostname.includes(rule.pattern)
      } catch {
        return false
      }
    }
    return false
  })
}

export function getBlockedAds(): BlockedAd[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("orbit_blocked_ads")
  return saved ? JSON.parse(saved) : []
}

export function addBlockedAd(ad: Omit<BlockedAd, "id" | "timestamp">) {
  const blocked = getBlockedAds()
  const newAd: BlockedAd = {
    ...ad,
    id: Date.now().toString(),
    timestamp: new Date(),
  }
  localStorage.setItem("orbit_blocked_ads", JSON.stringify([newAd, ...blocked.slice(0, 999)]))
}

export function clearBlockedAds() {
  localStorage.setItem("orbit_blocked_ads", JSON.stringify([]))
}

export function getBlockedAdsCount(): number {
  return getBlockedAds().length
}

export function getBlockedAdsToday(): number {
  const blocked = getBlockedAds()
  const today = new Date().setHours(0, 0, 0, 0)
  return blocked.filter((ad) => new Date(ad.timestamp).getTime() >= today).length
}
