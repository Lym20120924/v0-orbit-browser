"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Star,
  Menu,
  Search,
  Lock,
  Settings,
  Download,
  Columns2,
  Globe,
  Smartphone,
  Languages,
  FileText,
  Bot,
  User,
  LogOut,
  Code2,
  Key,
  BookOpen,
  EyeOff,
  Maximize,
  Puzzle,
  Shield,
  Activity,
  Video,
  Sparkles,
  FolderKanban,
  Clock,
  Cloud,
  QrCode,
  Rss,
  PenTool,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import type { User as UserType } from "@/lib/auth"
import { playSound } from "@/lib/sounds"

interface BrowserToolbarProps {
  url: string
  isLoading?: boolean
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onRefresh: () => void
  onHome: () => void
  onToggleSidebar: () => void
  onAddBookmark: () => void
  onOpenSettings: () => void
  onOpenDownloads: () => void
  onToggleSplitView: () => void
  onToggleDeviceEmulation: () => void
  onOpenAuth: () => void
  onOpenTranslate: () => void
  onOpenFileViewer: () => void
  onOpenDevTools: () => void
  onOpenPasswordManager: () => void
  onToggleReadingMode: () => void
  onToggleIncognito: () => void
  onToggleFullscreen: () => void
  isBookmarked: boolean
  canGoBack: boolean
  canGoForward: boolean
  splitView: boolean
  downloadsCount: number
  deviceEmulationEnabled: boolean
  incognitoMode: boolean
  devToolsOpen: boolean
  readingModeOpen: boolean
  fullscreen: boolean
  user: UserType | null
  onOpenExtensions?: () => void
  onOpenAdBlocker?: () => void
  onOpenPerformanceMonitor?: () => void
  onOpenScreenRecorder?: () => void
  onOpenTabGroups?: () => void
  onOpenSessionManager?: () => void
  onOpenAIAssistant?: () => void
  onOpenCloudSync?: () => void
  onOpenQRGenerator?: () => void
  onOpenPageAnnotations?: () => void
  onOpenRSSReader?: () => void
  onOpenWorkspaceManager?: () => void
  onOpenPageAnalyzer?: () => void
  onOpenSmartBookmarks?: () => void
  onOpenAPIHub?: () => void
  onOpenAIChat?: () => void
}

function AnimatedIconButton({
  onClick,
  disabled,
  active,
  title,
  badge,
  children,
  className,
  soundEffect = "click",
}: {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  title?: string
  badge?: number
  children: React.ReactNode
  className?: string
  soundEffect?: "click" | "tab" | "toggle" | "bookmark" | "refresh" | "pop" | "whoosh"
}) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    playSound(soundEffect)
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)

    // Ripple effect
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)

    onClick()
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => !disabled && playSound("hover")}
      disabled={disabled}
      title={title}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 overflow-hidden",
        disabled
          ? "cursor-not-allowed text-muted-foreground/30"
          : active
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:scale-105",
        isPressed && !disabled && "scale-90",
        className,
      )}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-primary/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
        />
      ))}
      <div className={cn("transition-transform duration-200", !disabled && "group-hover:scale-110")}>{children}</div>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-badge-pop">
          {badge}
        </span>
      )}
    </button>
  )
}

export function BrowserToolbar({
  url,
  isLoading,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onHome,
  onToggleSidebar,
  onAddBookmark,
  onOpenSettings,
  onOpenDownloads,
  onToggleSplitView,
  onToggleDeviceEmulation,
  onOpenAuth,
  onOpenTranslate,
  onOpenFileViewer,
  onOpenDevTools,
  onOpenPasswordManager,
  onToggleReadingMode,
  onToggleIncognito,
  onToggleFullscreen,
  isBookmarked,
  canGoBack,
  canGoForward,
  splitView,
  downloadsCount,
  deviceEmulationEnabled,
  incognitoMode,
  devToolsOpen,
  readingModeOpen,
  fullscreen,
  user,
  onOpenExtensions,
  onOpenAdBlocker,
  onOpenPerformanceMonitor,
  onOpenScreenRecorder,
  onOpenTabGroups,
  onOpenSessionManager,
  onOpenAIAssistant,
  onOpenCloudSync,
  onOpenQRGenerator,
  onOpenPageAnnotations,
  onOpenRSSReader,
  onOpenWorkspaceManager,
  onOpenPageAnalyzer,
  onOpenSmartBookmarks,
  onOpenAPIHub,
  onOpenAIChat,
}: BrowserToolbarProps) {
  const { translate } = useBrowser()
  const [inputValue, setInputValue] = useState(url)
  const [isFocused, setIsFocused] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [bookmarkAnimating, setBookmarkAnimating] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setInputValue(url === "orbit://newtab" ? "" : url)
    }
  }, [url, isFocused])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      playSound("whoosh")
      onNavigate(inputValue.trim())
      setIsFocused(false)
    }
  }

  const handleBookmark = () => {
    playSound("bookmark")
    setBookmarkAnimating(true)
    setTimeout(() => setBookmarkAnimating(false), 400)
    onAddBookmark()
  }

  const handleRefresh = () => {
    playSound("refresh")
    onRefresh()
  }

  const isSecure = url.startsWith("https://") || url.startsWith("orbit://")
  const isOrbitPage = url.startsWith("orbit://")

  return (
    <div className="flex h-12 items-center gap-2 border-b border-border bg-background px-3 animate-fade-in-down">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <AnimatedIconButton onClick={onBack} disabled={!canGoBack} soundEffect="click">
          <ArrowLeft className="h-4 w-4" />
        </AnimatedIconButton>
        <AnimatedIconButton onClick={onForward} disabled={!canGoForward} soundEffect="click">
          <ArrowRight className="h-4 w-4" />
        </AnimatedIconButton>
        <AnimatedIconButton onClick={handleRefresh} soundEffect="refresh">
          <RotateCw className={cn("h-4 w-4", isLoading && "animate-icon-spin")} />
        </AnimatedIconButton>
        <AnimatedIconButton onClick={onHome} soundEffect="click">
          <Home className="h-4 w-4" />
        </AnimatedIconButton>
      </div>

      <form onSubmit={handleSubmit} className="flex-1">
        <div
          className={cn(
            "flex h-9 items-center gap-2 rounded-full px-4 transition-all duration-300",
            isFocused
              ? "bg-secondary ring-2 ring-primary/50 scale-[1.02] shadow-lg shadow-primary/10"
              : "bg-secondary hover:bg-secondary/80",
          )}
        >
          <div className={cn("transition-all duration-200", isFocused && "scale-110")}>
            {isOrbitPage ? (
              <Globe className="h-4 w-4 text-primary animate-pulse" />
            ) : isSecure ? (
              <Lock className="h-4 w-4 text-accent" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              playSound("click")
              setIsFocused(true)
              if (url !== "orbit://newtab") {
                setInputValue(url)
              }
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={translate("searchOrEnterUrl")}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {!isFocused && inputValue && (
            <button
              type="submit"
              onMouseEnter={() => playSound("hover")}
              className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform duration-200"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleBookmark}
          onMouseEnter={() => playSound("hover")}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-secondary",
            isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground",
            bookmarkAnimating && "animate-tada",
          )}
          title={translate("bookmarks")}
        >
          <Star className={cn("h-4 w-4 transition-all duration-200", isBookmarked && "fill-primary scale-110")} />
        </button>

        {onOpenExtensions && (
          <AnimatedIconButton onClick={onOpenExtensions} title={translate("extensions")} soundEffect="pop">
            <Puzzle className="h-4 w-4" />
          </AnimatedIconButton>
        )}

        {onOpenAdBlocker && (
          <AnimatedIconButton onClick={onOpenAdBlocker} title={translate("adBlocker")} soundEffect="pop">
            <Shield className="h-4 w-4" />
          </AnimatedIconButton>
        )}

        <AnimatedIconButton
          onClick={onToggleReadingMode}
          active={readingModeOpen}
          title={translate("readingMode")}
          soundEffect="toggle"
        >
          <BookOpen className="h-4 w-4" />
        </AnimatedIconButton>

        <AnimatedIconButton onClick={onOpenTranslate} title={translate("translate")} soundEffect="pop">
          <Languages className="h-4 w-4" />
        </AnimatedIconButton>

        <AnimatedIconButton onClick={onOpenFileViewer} title={translate("fileViewer")} soundEffect="pop">
          <FileText className="h-4 w-4" />
        </AnimatedIconButton>

        {onOpenAIAssistant && (
          <AnimatedIconButton onClick={onOpenAIAssistant} title={translate("aiAssistant")} soundEffect="pop">
            <Sparkles className="h-4 w-4" />
          </AnimatedIconButton>
        )}

        {onOpenSmartBookmarks && (
          <AnimatedIconButton onClick={onOpenSmartBookmarks} title={translate("smartBookmarks")} soundEffect="pop">
            <Star className="h-4 w-4 fill-current" />
          </AnimatedIconButton>
        )}

        {onOpenQRGenerator && (
          <AnimatedIconButton onClick={onOpenQRGenerator} title={translate("qrGenerator")} soundEffect="pop">
            <QrCode className="h-4 w-4" />
          </AnimatedIconButton>
        )}

        {onOpenRSSReader && (
          <AnimatedIconButton onClick={onOpenRSSReader} title={translate("rssReader")} soundEffect="pop">
            <Rss className="h-4 w-4" />
          </AnimatedIconButton>
        )}

        {onOpenPageAnnotations && (
          <AnimatedIconButton onClick={onOpenPageAnnotations} title={translate("pageAnnotations")} soundEffect="pop">
            <PenTool className="h-4 w-4" />
          </AnimatedIconButton>
        )}

        <div className="relative">
          <AnimatedIconButton
            onClick={() => {
              playSound("click")
              setShowToolsMenu(!showToolsMenu)
            }}
            title={translate("moreTools")}
            soundEffect="pop"
          >
            <Code2 className="h-4 w-4" />
          </AnimatedIconButton>

          {showToolsMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowToolsMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl animate-panel-appear max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => {
                    playSound("click")
                    onOpenDevTools()
                    setShowToolsMenu(false)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-secondary hover:scale-[1.02]",
                    devToolsOpen ? "text-primary bg-primary/10" : "text-foreground",
                  )}
                >
                  <Code2 className="h-4 w-4" />
                  {translate("developerTools")}
                </button>
                {onOpenPerformanceMonitor && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenPerformanceMonitor()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Activity className="h-4 w-4" />
                    {translate("performanceMonitor")}
                  </button>
                )}
                {onOpenScreenRecorder && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenScreenRecorder()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Video className="h-4 w-4" />
                    {translate("screenRecorder")}
                  </button>
                )}
                <button
                  onClick={() => {
                    playSound("click")
                    onOpenPasswordManager()
                    setShowToolsMenu(false)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                >
                  <Key className="h-4 w-4" />
                  {translate("passwordManager")}
                </button>
                <button
                  onClick={() => {
                    playSound("click")
                    onToggleIncognito()
                    setShowToolsMenu(false)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-secondary hover:scale-[1.02]",
                    incognitoMode ? "text-primary bg-primary/10" : "text-foreground",
                  )}
                >
                  <EyeOff className="h-4 w-4" />
                  {translate("incognitoMode")}
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => {
                    playSound("click")
                    onToggleFullscreen()
                    setShowToolsMenu(false)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                >
                  <Maximize className="h-4 w-4" />
                  {translate("fullscreen")}
                </button>
                <div className="my-1 border-t border-border" />
                {onOpenTabGroups && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenTabGroups()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <FolderKanban className="h-4 w-4" />
                    {translate("tabGroups")}
                  </button>
                )}
                {onOpenSessionManager && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenSessionManager()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Clock className="h-4 w-4" />
                    {translate("sessionManager")}
                  </button>
                )}
                {onOpenCloudSync && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenCloudSync()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Cloud className="h-4 w-4" />
                    {translate("cloudSync")}
                  </button>
                )}
                {onOpenWorkspaceManager && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenWorkspaceManager()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Briefcase className="h-4 w-4" />
                    {translate("workspaceManager")}
                  </button>
                )}
                {onOpenPageAnalyzer && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenPageAnalyzer()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Search className="h-4 w-4" />
                    {translate("pageAnalyzer")}
                  </button>
                )}
                {onOpenAPIHub && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenAPIHub()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Globe className="h-4 w-4" />
                    {translate("apiHub")}
                  </button>
                )}
                {onOpenAIChat && (
                  <button
                    onClick={() => {
                      playSound("click")
                      onOpenAIChat()
                      setShowToolsMenu(false)
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary hover:scale-[1.02]"
                  >
                    <Bot className="h-4 w-4" />
                    {translate("aiChat") || "AI Chat"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <AnimatedIconButton
          onClick={onToggleDeviceEmulation}
          active={deviceEmulationEnabled}
          title={translate("deviceEmulation")}
          soundEffect="toggle"
        >
          <Smartphone className="h-4 w-4" />
        </AnimatedIconButton>

        <AnimatedIconButton
          onClick={onToggleSplitView}
          active={splitView}
          title="Toggle split view"
          soundEffect="toggle"
        >
          <Columns2 className="h-4 w-4" />
        </AnimatedIconButton>

        <AnimatedIconButton
          onClick={onOpenDownloads}
          badge={downloadsCount}
          title={translate("downloads")}
          soundEffect="pop"
        >
          <Download className="h-4 w-4" />
        </AnimatedIconButton>

        <AnimatedIconButton onClick={onOpenSettings} title={translate("settings")} soundEffect="pop">
          <Settings className="h-4 w-4" />
        </AnimatedIconButton>

        <div className="relative">
          <button
            onClick={() => {
              playSound("click")
              user ? setShowUserMenu(!showUserMenu) : onOpenAuth()
            }}
            onMouseEnter={() => playSound("hover")}
            className={cn(
              "flex h-8 items-center justify-center gap-2 rounded-lg px-2 transition-all duration-200 hover:bg-secondary hover:scale-105",
              user ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            title={user ? translate("profile") : translate("login")}
          >
            {user ? (
              <>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-scale-in">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-xs font-medium md:block">{user.username}</span>
              </>
            ) : (
              <User className="h-4 w-4" />
            )}
          </button>

          {showUserMenu && user && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-xl animate-panel-appear">
                <div className="mb-2 border-b border-border pb-2">
                  <p className="px-2 text-sm font-medium text-foreground">{user.username}</p>
                  <p className="px-2 text-xs text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    playSound("click")
                    setShowUserMenu(false)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-[1.02]"
                >
                  <LogOut className="h-4 w-4" />
                  {translate("logout")}
                </button>
              </div>
            </>
          )}
        </div>

        <AnimatedIconButton onClick={onToggleSidebar} title="Toggle sidebar" soundEffect="whoosh">
          <Menu className="h-4 w-4" />
        </AnimatedIconButton>
      </div>
    </div>
  )
}
