export interface Extension {
  id: string
  name: string
  description: string
  version: string
  author: string
  icon: string
  enabled: boolean
  permissions: string[]
  rating: number
  downloads: number
  category: "productivity" | "privacy" | "developer" | "social" | "media" | "other"
  scripts?: {
    background?: string
    content?: string
  }
}

export interface ExtensionAPI {
  tabs: {
    getCurrent: () => Promise<any>
    query: (queryInfo: any) => Promise<any[]>
    create: (createProperties: any) => Promise<any>
    update: (tabId: number, updateProperties: any) => Promise<any>
  }
  storage: {
    local: {
      get: (keys: string[]) => Promise<any>
      set: (items: any) => Promise<void>
    }
  }
  runtime: {
    sendMessage: (message: any) => Promise<any>
    onMessage: {
      addListener: (callback: Function) => void
    }
  }
}

const MARKETPLACE_EXTENSIONS: Extension[] = [
  {
    id: "ext_adblocker",
    name: "Ad Blocker Plus",
    description: "Block ads and trackers across all websites",
    version: "1.0.0",
    author: "Orbit Team",
    icon: "🛡️",
    enabled: false,
    permissions: ["webRequest", "storage"],
    rating: 4.8,
    downloads: 1500000,
    category: "privacy",
  },
  {
    id: "ext_darkmode",
    name: "Dark Mode Everywhere",
    description: "Apply dark mode to any website automatically",
    version: "2.1.0",
    author: "Community",
    icon: "🌙",
    enabled: false,
    permissions: ["tabs", "storage"],
    rating: 4.6,
    downloads: 850000,
    category: "productivity",
  },
  {
    id: "ext_translator",
    name: "Instant Translate",
    description: "Translate selected text instantly",
    version: "1.5.2",
    author: "Orbit Team",
    icon: "🌐",
    enabled: false,
    permissions: ["selection", "contextMenus"],
    rating: 4.7,
    downloads: 620000,
    category: "productivity",
  },
  {
    id: "ext_screenshot",
    name: "Super Screenshot",
    description: "Capture full page screenshots with annotations",
    version: "3.0.1",
    author: "Community",
    icon: "📸",
    enabled: false,
    permissions: ["tabs", "downloads"],
    rating: 4.9,
    downloads: 980000,
    category: "productivity",
  },
  {
    id: "ext_devtools",
    name: "Enhanced DevTools",
    description: "Advanced developer tools with React inspector",
    version: "1.2.0",
    author: "Orbit Team",
    icon: "🔧",
    enabled: false,
    permissions: ["devtools", "tabs"],
    rating: 4.8,
    downloads: 450000,
    category: "developer",
  },
  {
    id: "ext_password",
    name: "Secure Password Manager",
    description: "Generate and store secure passwords",
    version: "2.0.0",
    author: "Security Co",
    icon: "🔐",
    enabled: false,
    permissions: ["storage", "tabs"],
    rating: 4.7,
    downloads: 720000,
    category: "privacy",
  },
]

export function getExtensions(): Extension[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("orbit_extensions")
  return saved ? JSON.parse(saved) : []
}

export function saveExtensions(extensions: Extension[]) {
  localStorage.setItem("orbit_extensions", JSON.stringify(extensions))
}

export function getMarketplaceExtensions(): Extension[] {
  return MARKETPLACE_EXTENSIONS
}

export function installExtension(extensionId: string) {
  const marketplace = getMarketplaceExtensions()
  const extension = marketplace.find((ext) => ext.id === extensionId)
  if (!extension) return

  const installed = getExtensions()
  if (!installed.find((ext) => ext.id === extensionId)) {
    saveExtensions([...installed, { ...extension, enabled: true }])
  }
}

export function uninstallExtension(extensionId: string) {
  const extensions = getExtensions().filter((ext) => ext.id !== extensionId)
  saveExtensions(extensions)
}

export function toggleExtension(extensionId: string) {
  const extensions = getExtensions().map((ext) => (ext.id === extensionId ? { ...ext, enabled: !ext.enabled } : ext))
  saveExtensions(extensions)
}
