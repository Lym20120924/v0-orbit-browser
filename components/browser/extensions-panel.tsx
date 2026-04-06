"use client"

import { X, Search, Download, Trash2, Star, ChevronDown, Filter } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"
import {
  type Extension,
  getExtensions,
  getMarketplaceExtensions,
  installExtension,
  uninstallExtension,
  toggleExtension,
} from "@/lib/extensions"

interface ExtensionsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ExtensionsPanel({ isOpen, onClose }: ExtensionsPanelProps) {
  const { translate } = useBrowser()
  const [activeTab, setActiveTab] = useState<"installed" | "marketplace">("installed")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [installedExtensions, setInstalledExtensions] = useState<Extension[]>(getExtensions())
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)

  if (!isOpen) return null

  const marketplace = getMarketplaceExtensions()
  const categories = ["all", "productivity", "privacy", "developer", "social", "media", "other"]

  const filteredMarketplace = marketplace.filter((ext) => {
    const matchesSearch =
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || ext.category === categoryFilter
    const notInstalled = !installedExtensions.find((installed) => installed.id === ext.id)
    return matchesSearch && matchesCategory && notInstalled
  })

  const handleInstall = (extensionId: string) => {
    installExtension(extensionId)
    setInstalledExtensions(getExtensions())
    playSound("success")
  }

  const handleUninstall = (extensionId: string) => {
    uninstallExtension(extensionId)
    setInstalledExtensions(getExtensions())
    playSound("pop")
  }

  const handleToggle = (extensionId: string) => {
    toggleExtension(extensionId)
    setInstalledExtensions(getExtensions())
    playSound("toggle")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">{translate("extensions") || "Extensions"}</h2>
          <button
            onClick={() => {
              playSound("whoosh")
              onClose()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => {
              setActiveTab("installed")
              playSound("click")
            }}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-all",
              activeTab === "installed"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {translate("installed") || "Installed"} ({installedExtensions.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("marketplace")
              playSound("click")
            }}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-all",
              activeTab === "marketplace"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {translate("marketplace") || "Marketplace"}
          </button>
        </div>

        {/* Search and Filters */}
        {activeTab === "marketplace" && (
          <div className="flex gap-3 border-b border-border p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translate("searchExtensions") || "Search extensions..."}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:border-primary"
              >
                <Filter className="h-4 w-4" />
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showCategoryMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg animate-scale-in">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat)
                        setShowCategoryMenu(false)
                        playSound("click")
                      }}
                      className="w-full px-4 py-2 text-left text-sm capitalize hover:bg-secondary"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "installed" ? (
            installedExtensions.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <p className="text-lg">{translate("noExtensions") || "No extensions installed"}</p>
                <p className="mt-2 text-sm">
                  {translate("browseMarketplace") || "Browse the marketplace to install extensions"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {installedExtensions.map((ext, index) => (
                  <div
                    key={ext.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-secondary/50 p-4 animate-stagger-fade-in hover:border-primary/50 transition-all"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="text-4xl">{ext.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{ext.name}</h3>
                      <p className="text-sm text-muted-foreground">{ext.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        v{ext.version} by {ext.author}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle(ext.id)}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-all",
                        ext.enabled ? "bg-primary" : "bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all",
                          ext.enabled ? "translate-x-5" : "translate-x-0.5",
                        )}
                      />
                    </button>
                    <button
                      onClick={() => handleUninstall(ext.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredMarketplace.map((ext, index) => (
                <div
                  key={ext.id}
                  className="rounded-xl border border-border bg-secondary/50 p-6 animate-stagger-fade-in hover:border-primary/50 transition-all"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="mb-4 flex items-start gap-4">
                    <span className="text-5xl">{ext.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{ext.name}</h3>
                      <p className="text-xs text-muted-foreground">by {ext.author}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span>{ext.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{(ext.downloads / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{ext.description}</p>
                  <button
                    onClick={() => handleInstall(ext.id)}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
                  >
                    {translate("install") || "Install"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
