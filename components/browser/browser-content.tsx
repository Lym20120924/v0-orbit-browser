"use client"

import {
  Globe,
  Search,
  Zap,
  Shield,
  Rocket,
  Download,
  ExternalLink,
  FileText,
  ImageIcon,
  Film,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from "lucide-react"
import type { Bookmark, Download as DownloadType } from "../orbit-browser"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { mightBlockIframe, getProxyUrl, getProxyName, getTotalProxies } from "@/lib/proxy"
import { playSound } from "@/lib/sounds"

interface BrowserContentProps {
  url: string
  isLoading?: boolean
  bookmarks: Bookmark[]
  onNavigate: (url: string) => void
  onDownload: (download: Omit<DownloadType, "id" | "progress" | "status" | "startedAt">) => void
  className?: string
  deviceType?: "mobile" | "tablet" | "desktop"
}

export function BrowserContent({
  url,
  isLoading,
  bookmarks,
  onNavigate,
  onDownload,
  className,
  deviceType,
}: BrowserContentProps) {
  const { translate, settings } = useBrowser()
  const [iframeError, setIframeError] = useState(false)
  const [useProxy, setUseProxy] = useState(false)
  const [proxyIndex, setProxyIndex] = useState(0)
  const [loadAttempts, setLoadAttempts] = useState(0)
  const [autoRetrying, setAutoRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    setIframeError(false)
    setUseProxy(false)
    setProxyIndex(0)
    setLoadAttempts(0)
    setAutoRetrying(false)
    setRetryCount(0)
  }, [url])

  useEffect(() => {
    if (settings.browsingMode === "proxy" && mightBlockIframe(url)) {
      setUseProxy(true)
    }
  }, [url, settings.browsingMode])

  useEffect(() => {
    if (iframeError && !autoRetrying && retryCount < getTotalProxies()) {
      console.log(`[v0] Iframe load failed, auto-retrying with proxy ${retryCount + 1}/${getTotalProxies()}`)
      setAutoRetrying(true)
      playSound("error")

      // 等待2秒后尝试下一个代理
      setTimeout(() => {
        setProxyIndex((prev) => prev + 1)
        setUseProxy(true)
        setIframeError(false)
        setLoadAttempts((prev) => prev + 1)
        setRetryCount((prev) => prev + 1)
        setAutoRetrying(false)
        playSound("refresh")
      }, 2000)
    }
  }, [iframeError, autoRetrying, retryCount])

  if (isLoading) {
    return (
      <div className={cn("flex flex-1 items-center justify-center bg-background", className)}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            {/* Outer ring */}
            <div
              className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
              style={{ animationDuration: "1s" }}
            />
            {/* Inner ring - reverse */}
            <div
              className="absolute inset-2 h-16 w-16 animate-spin rounded-full border-4 border-accent/20 border-b-accent"
              style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
            />
            {/* Center icon */}
            <div className="flex h-20 w-20 items-center justify-center">
              <Rocket className="h-8 w-8 text-primary animate-float" />
            </div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <p className="font-medium text-foreground">{translate("loading")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{translate("pleaseWait")}</p>
          </div>
          {/* Loading dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-primary animate-loading-dot"
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (url === "orbit://newtab") {
    return <NewTabPage bookmarks={bookmarks} onNavigate={onNavigate} className={className} deviceType={deviceType} />
  }

  if (url === "orbit://downloads") {
    return <DownloadsPage className={className} />
  }

  if (url === "orbit://settings") {
    return <SettingsPage className={className} />
  }

  const isExternalUrl = url.startsWith("http://") || url.startsWith("https://")

  if (isExternalUrl && (settings.browsingMode === "live" || settings.browsingMode === "proxy")) {
    const displayUrl = useProxy ? getProxyUrl(url, proxyIndex) : url
    const currentProxyName = getProxyName(proxyIndex)

    return (
      <div className={cn("flex flex-1 flex-col bg-background", className)}>
        {useProxy && (
          <div className="flex items-center justify-between bg-primary/10 px-4 py-2 animate-slide-in-up">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">
                {translate("proxyEnabled")} - {currentProxyName} ({proxyIndex + 1}/{getTotalProxies()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {retryCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {translate("retried")} {retryCount} {translate("times")}
                </span>
              )}
              <button
                onClick={() => {
                  playSound("click")
                  setUseProxy(false)
                  setIframeError(false)
                  setProxyIndex(0)
                  setRetryCount(0)
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {translate("disable")}
              </button>
            </div>
          </div>
        )}

        {autoRetrying && (
          <div className="flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 animate-slide-in-up">
            <Loader2 className="h-4 w-4 text-accent animate-spin" />
            <span className="text-xs font-medium text-accent">
              {translate("autoRetrying")} ({retryCount + 1}/{getTotalProxies()})...
            </span>
          </div>
        )}

        {iframeError && retryCount >= getTotalProxies() - 1 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 animate-fade-in">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 animate-bounce-in">
                <AlertTriangle className="h-10 w-10 text-destructive animate-icon-shake" />
              </div>
              <h2
                className="mb-2 text-xl font-semibold text-foreground animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                {translate("cannotLoadInFrame")}
              </h2>
              <p className="mb-2 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                {translate("siteBlockedIframe")}
              </p>
              <p className="mb-6 text-xs text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
                {translate("triedAllProxies")} ({getTotalProxies()})
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    playSound("refresh")
                    setProxyIndex(0)
                    setUseProxy(true)
                    setIframeError(false)
                    setLoadAttempts((prev) => prev + 1)
                    setRetryCount(0)
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3",
                    "text-sm font-medium text-accent-foreground",
                    "transition-all duration-200 hover:bg-accent/90 hover:scale-105 active:scale-95",
                    "animate-fade-in-up",
                  )}
                  style={{ animationDelay: "0.3s" }}
                >
                  <RefreshCw className="h-4 w-4" />
                  {translate("retryFromStart")}
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound("whoosh")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3",
                    "text-sm font-medium text-foreground",
                    "transition-all duration-200 hover:bg-secondary/80 hover:scale-105 active:scale-95",
                    "animate-fade-in-up",
                  )}
                  style={{ animationDelay: "0.4s" }}
                >
                  <ExternalLink className="h-4 w-4" />
                  {translate("openInNewWindow")}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            key={`${url}-${loadAttempts}-${useProxy}-${proxyIndex}`}
            src={displayUrl}
            className="h-full w-full border-0 animate-fade-in"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => {
              console.log(`[v0] Iframe error for URL: ${displayUrl}, proxy index: ${proxyIndex}`)
              setIframeError(true)
            }}
            onLoad={() => {
              console.log(`[v0] Iframe loaded successfully: ${displayUrl}`)
              if (useProxy) {
                playSound("success")
              }
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-1 flex-col bg-background", className)}>
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl animate-scale-in">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg hover-lift">
            <div className="mb-6 flex items-center gap-4">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-xl",
                  "bg-gradient-to-br from-primary/20 to-accent/20",
                  "animate-float",
                )}
              >
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="truncate text-xl font-semibold text-foreground">
                  {url.replace(/^https?:\/\//, "").split("/")[0]}
                </h2>
                <p className="truncate text-sm text-muted-foreground">{url}</p>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {url.startsWith("https://") && (
                <span className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs text-accent animate-fade-in">
                  <Shield className="h-3 w-3" />
                  {translate("secureConnection")}
                </span>
              )}
              <span
                className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                {translate("externalSite")}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3",
                  "text-sm font-medium text-primary-foreground",
                  "transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95",
                )}
              >
                <ExternalLink className="h-4 w-4" />
                {translate("openInNewWindow")}
              </a>
              <button
                onClick={() =>
                  onDownload({
                    filename: `${url.replace(/^https?:\/\//, "").split("/")[0]}.html`,
                    url,
                    size: "~2.5 MB",
                  })
                }
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3",
                  "text-sm font-medium text-foreground",
                  "transition-all duration-200 hover:bg-secondary/80 hover:scale-105 active:scale-95",
                )}
              >
                <Download className="h-4 w-4" />
                {translate("savePage")}
              </button>
            </div>
          </div>

          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <p className="mb-3 text-sm font-medium text-muted-foreground">{translate("quickDownloads")}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FileText, label: "PDF", ext: "pdf", size: "1.2 MB" },
                { icon: ImageIcon, label: "Image", ext: "png", size: "450 KB" },
                { icon: Film, label: "Video", ext: "mp4", size: "15 MB" },
              ].map((item, index) => (
                <button
                  key={item.ext}
                  onClick={() =>
                    onDownload({
                      filename: `download.${item.ext}`,
                      url: `${url}/file.${item.ext}`,
                      size: item.size,
                    })
                  }
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4",
                    "transition-all duration-200 hover:bg-secondary hover:scale-105 hover:shadow-lg",
                    "active:scale-95",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <item.icon className="h-6 w-6 text-primary" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewTabPage({
  bookmarks,
  onNavigate,
  className,
  deviceType,
}: {
  bookmarks: Bookmark[]
  onNavigate: (url: string) => void
  className?: string
  deviceType?: "mobile" | "tablet" | "desktop"
}) {
  const { translate } = useBrowser()
  const isMobile = deviceType === "mobile"

  const quickLinks = [
    { title: "Google", url: "https://google.com", icon: Search, color: "from-blue-500 to-blue-600" },
    { title: "GitHub", url: "https://github.com", icon: Globe, color: "from-gray-600 to-gray-700" },
    { title: "YouTube", url: "https://youtube.com", icon: Zap, color: "from-red-500 to-red-600" },
    { title: "Twitter", url: "https://twitter.com", icon: Globe, color: "from-sky-400 to-sky-500" },
  ]

  return (
    <div className={cn("flex flex-1 flex-col items-center overflow-auto bg-background px-4 py-8", className)}>
      <div className={cn("flex w-full flex-col items-center", isMobile ? "max-w-sm" : "max-w-3xl")}>
        <div className="mb-6 flex flex-col items-center animate-bounce-in">
          <div className="relative mb-3">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
            <div
              className="absolute inset-0 animate-ping rounded-full bg-primary/10"
              style={{ animationDuration: "2s" }}
            />
            <div
              className={cn(
                "relative flex items-center justify-center rounded-full",
                "bg-gradient-to-br from-primary via-primary/80 to-accent",
                "shadow-xl shadow-primary/20 animate-float",
                isMobile ? "h-20 w-20" : "h-28 w-28",
              )}
            >
              <Rocket className={cn("text-primary-foreground", isMobile ? "h-10 w-10" : "h-14 w-14")} />
              {/* Orbiting dot */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
                <div className="absolute -right-1 top-1/2 h-3 w-3 rounded-full bg-accent shadow-lg" />
              </div>
            </div>
          </div>
          <h1
            className={cn(
              "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-transparent",
              isMobile ? "text-2xl" : "text-4xl",
            )}
          >
            Orbit Browser
          </h1>
          <p
            className={cn("mt-1 text-muted-foreground animate-fade-in", isMobile ? "text-xs" : "text-sm")}
            style={{ animationDelay: "0.3s" }}
          >
            {translate("fast")}, {translate("secure")}, {translate("modern")}
          </p>
        </div>

        <div
          className={cn("mb-8 w-full animate-fade-in-up", isMobile ? "max-w-full" : "max-w-xl")}
          style={{ animationDelay: "0.2s" }}
        >
          <div
            className={cn(
              "group flex items-center gap-3 rounded-2xl bg-secondary px-4",
              "shadow-lg ring-1 ring-border transition-all duration-300",
              "focus-within:ring-2 focus-within:ring-primary/50 focus-within:scale-[1.02] focus-within:shadow-xl focus-within:shadow-primary/10",
              isMobile ? "h-12" : "h-14",
            )}
          >
            <Search
              className={cn(
                "text-muted-foreground transition-all duration-200 group-focus-within:text-primary group-focus-within:scale-110",
                isMobile ? "h-4 w-4" : "h-5 w-5",
              )}
            />
            <input
              type="text"
              placeholder={translate("searchOrEnterUrl")}
              className={cn(
                "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none",
                isMobile ? "text-sm" : "text-base",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  onNavigate(e.currentTarget.value.trim())
                }
              }}
            />
          </div>
        </div>

        <div className="mb-8 w-full">
          <h2
            className={cn(
              "mb-3 text-center font-medium text-muted-foreground animate-fade-in",
              isMobile ? "text-xs" : "text-sm",
            )}
          >
            {translate("quickLinks")}
          </h2>
          <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-4")}>
            {quickLinks.map((link, index) => (
              <button
                key={link.title}
                onClick={() => onNavigate(link.url)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-2xl p-3",
                  "transition-all duration-200 hover:bg-secondary hover:scale-105 hover:shadow-lg",
                  "active:scale-95",
                  "animate-stagger-fade-in",
                )}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                    "transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3",
                    link.color,
                    isMobile ? "h-10 w-10 text-xs" : "h-14 w-14 text-sm",
                  )}
                >
                  <link.icon className={cn("text-white", isMobile ? "h-5 w-5" : "h-7 w-7")} />
                </div>
                <span
                  className={cn(
                    "text-muted-foreground group-hover:text-foreground transition-colors duration-200",
                    isMobile ? "text-xs" : "text-sm",
                  )}
                >
                  {link.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {bookmarks.length > 0 && (
          <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <h2 className={cn("mb-3 text-center font-medium text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
              {translate("bookmarks")}
            </h2>
            <div className={cn("grid gap-2", isMobile ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-5 md:grid-cols-6")}>
              {bookmarks.slice(0, isMobile ? 6 : 12).map((bookmark, index) => (
                <button
                  key={bookmark.id}
                  onClick={() => onNavigate(bookmark.url)}
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-xl p-2",
                    "transition-all duration-200 hover:bg-secondary hover:scale-105",
                    "active:scale-95",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-xl",
                      "bg-gradient-to-br from-primary/20 to-accent/20 font-bold text-primary",
                      "transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg",
                      isMobile ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm",
                    )}
                  >
                    {bookmark.title.charAt(0).toUpperCase()}
                  </div>
                  <span className="w-full truncate text-center text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {bookmark.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          className={cn("mt-8 flex animate-fade-in-up", isMobile ? "gap-6" : "gap-10")}
          style={{ animationDelay: "0.7s" }}
        >
          {[
            { icon: Shield, label: "secure", color: "bg-muted/50 text-muted-foreground border border-border" },
            { icon: Zap, label: "fast", color: "bg-primary/80 text-primary-foreground" },
            { icon: Rocket, label: "modern", color: "bg-accent/80 text-accent-foreground" },
          ].map((feature, index) => (
            <div
              key={feature.label}
              className={cn("flex flex-col items-center gap-2 group cursor-default", "animate-stagger-fade-in")}
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-all duration-200",
                  "group-hover:scale-110 group-hover:shadow-lg",
                  feature.color,
                  isMobile ? "h-12 w-12" : "h-16 w-16",
                )}
              >
                <feature.icon className={cn(isMobile ? "h-5 w-5" : "h-7 w-7")} />
              </div>
              <span className="text-xs text-muted-foreground">{translate(feature.label)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DownloadsPage({ className }: { className?: string }) {
  const { translate } = useBrowser()

  return (
    <div className={cn("flex flex-1 items-center justify-center bg-background", className)}>
      <div className="text-center animate-fade-in-up">
        <Download className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30 animate-float" />
        <h2 className="text-xl font-semibold text-foreground">{translate("downloads")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{translate("downloadsWillAppear")}</p>
      </div>
    </div>
  )
}

function SettingsPage({ className }: { className?: string }) {
  const { translate } = useBrowser()

  return (
    <div className={cn("flex flex-1 items-center justify-center bg-background", className)}>
      <div className="text-center animate-fade-in-up">
        <Shield className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30 animate-float" />
        <h2 className="text-xl font-semibold text-foreground">{translate("settings")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Browser settings and preferences</p>
      </div>
    </div>
  )
}
