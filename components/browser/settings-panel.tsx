"use client"

import { X, Monitor, Moon, Sun, Search, Home, Languages, Globe2, Wifi, Volume2, VolumeX } from "lucide-react"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { languages, type Language } from "@/lib/i18n"
import { playSound, getSoundEnabled, setSoundEnabled } from "@/lib/sounds"
import { useState } from "react"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, translate } = useBrowser()
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled())

  if (!isOpen) return null

  const handleSoundToggle = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    setSoundEnabledState(newValue)
    if (newValue) {
      playSound("toggle")
    }
  }

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const searchEngines = [
    { value: "google", label: "Google", icon: "G" },
    { value: "bing", label: "Bing", icon: "B" },
    { value: "duckduckgo", label: "DuckDuckGo", icon: "D" },
    { value: "yahoo", label: "Yahoo", icon: "Y" },
  ] as const

  const themes = [
    { value: "dark", label: translate("dark"), icon: Moon },
    { value: "light", label: translate("light"), icon: Sun },
    { value: "system", label: translate("system"), icon: Monitor },
  ] as const

  const browsingModes = [
    { value: "live", label: translate("livePreview"), icon: Globe2, description: "直接加载网页" },
    { value: "proxy", label: translate("proxyMode"), icon: Wifi, description: "通过代理绕过限制" },
    { value: "safe", label: translate("safeMode"), icon: Search, description: "仅显示预览卡片" },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">{translate("settings")}</h2>
          <button
            onClick={handleClose}
            onMouseEnter={() => playSound("hover")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:scale-110 hover:rotate-90 active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 scrollbar-thin">
          <div className="mb-8 animate-fade-in-up">
            <div className="mb-4 flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-primary" />
              )}
              <h3 className="font-medium text-foreground">{translate("soundEffects") || "Sound Effects"}</h3>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4 hover:border-primary/50 transition-all">
              <div>
                <p className="font-medium text-foreground">{translate("enableSounds") || "Enable Sounds"}</p>
                <p className="text-sm text-muted-foreground">
                  {translate("playSoundsOnInteraction") || "Play sounds on interactions"}
                </p>
              </div>
              <button
                onClick={handleSoundToggle}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-all duration-300",
                  soundEnabled ? "bg-primary" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300",
                    soundEnabled ? "translate-x-5 scale-100" : "translate-x-0.5 scale-90",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <div className="mb-4 flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">{translate("language")}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    playSound("click")
                    updateSettings({ language: lang.code as Language })
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-3 transition-all hover:scale-105 active:scale-95",
                    settings.language === lang.code
                      ? "border-primary bg-primary/10 text-foreground animate-jello"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-xs font-medium">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Engine */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">{translate("searchEngine")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {searchEngines.map((engine, index) => (
                <button
                  key={engine.value}
                  onClick={() => {
                    playSound("click")
                    updateSettings({ searchEngine: engine.value })
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 transition-all hover:scale-[1.02] active:scale-95",
                    settings.searchEngine === engine.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all",
                      settings.searchEngine === engine.value
                        ? "bg-primary text-primary-foreground animate-rubber-band"
                        : "bg-muted",
                    )}
                  >
                    {engine.icon}
                  </div>
                  <span className="font-medium">{engine.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="mb-4 flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">{translate("theme")}</h3>
            </div>
            <div className="flex gap-3">
              {themes.map((theme, index) => (
                <button
                  key={theme.value}
                  onClick={() => {
                    playSound("toggle")
                    updateSettings({ theme: theme.value })
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 rounded-xl border p-4 transition-all hover:scale-105 active:scale-95",
                    settings.theme === theme.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  <theme.icon
                    className={cn(
                      "h-6 w-6 transition-all",
                      settings.theme === theme.value ? "text-primary animate-swing" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Browsing Mode */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="mb-4 flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">{translate("browsingMode")}</h3>
            </div>
            <div className="space-y-3">
              {browsingModes.map((mode, index) => (
                <button
                  key={mode.value}
                  onClick={() => {
                    playSound("click")
                    updateSettings({ browsingMode: mode.value as "live" | "safe" | "proxy" })
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-4 transition-all text-left hover:scale-[1.01] active:scale-[0.99]",
                    settings.browsingMode === mode.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  <mode.icon
                    className={cn(
                      "h-6 w-6 transition-all",
                      settings.browsingMode === mode.value ? "text-primary animate-float" : "text-muted-foreground",
                    )}
                  />
                  <div className="flex-1">
                    <span className="font-medium">{mode.label}</span>
                    <p className="text-xs text-muted-foreground">{mode.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Home Page */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <div className="mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">{translate("homePage")}</h3>
            </div>
            <input
              type="text"
              value={settings.homePage}
              onChange={(e) => updateSettings({ homePage: e.target.value })}
              onFocus={() => playSound("click")}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:scale-[1.01] transition-all"
              placeholder="Enter home page URL"
            />
          </div>

          {/* Bookmarks Bar Toggle */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4 hover:border-primary/50 transition-all">
              <div>
                <p className="font-medium text-foreground">{translate("showBookmarksBar")}</p>
                <p className="text-sm text-muted-foreground">{translate("displayBookmarksBelow")}</p>
              </div>
              <button
                onClick={() => {
                  playSound("toggle")
                  updateSettings({ showBookmarksBar: !settings.showBookmarksBar })
                }}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-all duration-300",
                  settings.showBookmarksBar ? "bg-primary" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300",
                    settings.showBookmarksBar ? "translate-x-5 scale-100" : "translate-x-0.5 scale-90",
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-center text-xs text-muted-foreground">Orbit Browser v2.0.0</p>
        </div>
      </div>
    </div>
  )
}
