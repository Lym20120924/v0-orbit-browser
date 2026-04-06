"use client"

import { useState, useCallback, createContext, useContext } from "react"
import { BrowserToolbar } from "./browser/browser-toolbar"
import { TabBar } from "./browser/tab-bar"
import { BrowserContent } from "./browser/browser-content"
import { Sidebar } from "./browser/sidebar"
import { SettingsPanel } from "./browser/settings-panel"
import { DownloadsPanel } from "./browser/downloads-panel"
import { DeviceEmulator } from "./browser/device-emulator"
import { AuthPanel } from "./browser/auth-panel"
import { TranslatePanel } from "./browser/translate-panel"
import { FileViewer } from "./browser/file-viewer"
import { DeveloperToolsPanel } from "./browser/developer-tools-panel"
import { PasswordManagerPanel } from "./browser/password-manager-panel"
import { ReadingMode } from "./browser/reading-mode"
import { IncognitoIndicator } from "./browser/incognito-indicator"
import { type Language, t } from "@/lib/i18n"
import type { DevicePreset } from "@/lib/devices"
import type { User } from "@/lib/auth"
import { useGestureControls } from "@/lib/gesture-controls"
import { WorkspaceManagerPanel } from "./browser/workspace-manager-panel"
import { PageAnalyzerPanel } from "./browser/page-analyzer-panel"
import { SmartBookmarksPanel } from "./browser/smart-bookmarks-panel"
import { QRGeneratorPanel } from "./browser/qr-generator-panel"
import { PageAnnotationsPanel } from "./browser/page-annotations-panel"
import { RSSReaderPanel } from "./browser/rss-reader-panel"
import { ExtensionsPanel } from "./browser/extensions-panel"
import { AdBlockerPanel } from "./browser/ad-blocker-panel"
import { PerformanceMonitorPanel } from "./browser/performance-monitor-panel"
import { ScreenRecorderPanel } from "./browser/screen-recorder-panel"
import { TabGroupsPanel } from "./browser/tab-groups-panel"
import { SessionManagerPanel } from "./browser/session-manager-panel"
import { AIAssistantPanel } from "./browser/ai-assistant-panel"
import { CloudSyncPanel } from "./browser/cloud-sync-panel"
import { APIHubPanel } from "./browser/api-hub-panel"

export interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isLoading?: boolean
  historyStack: string[]
  historyIndex: number
}

export interface Bookmark {
  id: string
  title: string
  url: string
  favicon?: string
}

export interface Download {
  id: string
  filename: string
  url: string
  progress: number
  status: "downloading" | "completed" | "failed" | "paused"
  size: string
  startedAt: Date
}

export interface BrowserSettings {
  searchEngine: "google" | "bing" | "duckduckgo" | "yahoo"
  theme: "dark" | "light" | "system"
  homePage: string
  showBookmarksBar: boolean
  language: Language
  browsingMode: "live" | "safe" | "proxy"
}

interface BrowserContextType {
  settings: BrowserSettings
  updateSettings: (settings: Partial<BrowserSettings>) => void
  downloads: Download[]
  addDownload: (download: Omit<Download, "id" | "progress" | "status" | "startedAt">) => void
  translate: (key: string) => string
  user: User | null
}

export const BrowserContext = createContext<BrowserContextType | null>(null)

export function useBrowser() {
  const context = useContext(BrowserContext)
  if (!context) throw new Error("useBrowser must be used within BrowserProvider")
  return context
}

const createNewTab = (language: Language): Tab => ({
  id: Date.now().toString(),
  title: t("newTab", language),
  url: "orbit://newtab",
  isLoading: false,
  historyStack: ["orbit://newtab"],
  historyIndex: 0,
})

export function OrbitBrowser() {
  const [settings, setSettings] = useState<BrowserSettings>({
    searchEngine: "google",
    theme: "dark",
    homePage: "orbit://newtab",
    showBookmarksBar: true,
    language: "zh",
    browsingMode: "proxy",
  })

  const [tabs, setTabs] = useState<Tab[]>([createNewTab(settings.language)])
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [downloadsOpen, setDownloadsOpen] = useState(false)
  const [splitView, setSplitView] = useState(false)
  const [splitTabId, setSplitTabId] = useState<string | null>(null)

  const [deviceEmulationEnabled, setDeviceEmulationEnabled] = useState(false)
  const [currentDevice, setCurrentDevice] = useState<DevicePreset | null>(null)
  const [isRotated, setIsRotated] = useState(false)

  const [authOpen, setAuthOpen] = useState(false)
  const [translateOpen, setTranslateOpen] = useState(false)
  const [fileViewerOpen, setFileViewerOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "b1", title: "GitHub", url: "https://github.com" },
    { id: "b2", title: "Vercel", url: "https://vercel.com" },
    { id: "b3", title: "Next.js", url: "https://nextjs.org" },
    { id: "b4", title: "YouTube", url: "https://youtube.com" },
    { id: "b5", title: "Google", url: "https://google.com" },
  ])
  const [history, setHistory] = useState<{ title: string; url: string; time: Date }[]>([])
  const [downloads, setDownloads] = useState<Download[]>([])

  const [devToolsOpen, setDevToolsOpen] = useState(false)
  const [passwordManagerOpen, setPasswordManagerOpen] = useState(false)
  const [readingModeOpen, setReadingModeOpen] = useState(false)
  const [incognitoMode, setIncognitoMode] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const [extensionsOpen, setExtensionsOpen] = useState(false)
  const [adBlockerOpen, setAdBlockerOpen] = useState(false)
  const [performanceMonitorOpen, setPerformanceMonitorOpen] = useState(false)
  const [screenRecorderOpen, setScreenRecorderOpen] = useState(false)

  const [tabGroupsOpen, setTabGroupsOpen] = useState(false)
  const [sessionManagerOpen, setSessionManagerOpen] = useState(false)
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false)
  const [cloudSyncOpen, setCloudSyncOpen] = useState(false)

  const [qrGeneratorOpen, setQRGeneratorOpen] = useState(false)
  const [annotationsOpen, setAnnotationsOpen] = useState(false)
  const [rssReaderOpen, setRSSReaderOpen] = useState(false)
  const [workspaceManagerOpen, setWorkspaceManagerOpen] = useState(false)
  const [pageAnalyzerOpen, setPageAnalyzerOpen] = useState(false)
  const [smartBookmarksOpen, setSmartBookmarksOpen] = useState(false)
  const [apiHubOpen, setAPIHubOpen] = useState(false)

  const translate = useCallback((key: string) => t(key, settings.language), [settings.language])

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0]
  const splitTab = splitTabId ? tabs.find((tab) => tab.id === splitTabId) : null

  const handleCreateNewTab = useCallback(() => {
    const newTab = createNewTab(settings.language)
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)
  }, [settings.language])

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        if (prev.length === 1) {
          return [createNewTab(settings.language)]
        }
        const newTabs = prev.filter((tab) => tab.id !== tabId)
        if (activeTabId === tabId) {
          const closedIndex = prev.findIndex((tab) => tab.id === tabId)
          const newActiveIndex = Math.min(closedIndex, newTabs.length - 1)
          setActiveTabId(newTabs[newActiveIndex].id)
        }
        if (splitTabId === tabId) {
          setSplitTabId(null)
          setSplitView(false)
        }
        return newTabs
      })
    },
    [activeTabId, splitTabId, settings.language],
  )

  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setTabs((prev) => {
      const newTabs = [...prev]
      const [removed] = newTabs.splice(fromIndex, 1)
      newTabs.splice(toIndex, 0, removed)
      return newTabs
    })
  }, [])

  const getSearchUrl = useCallback(
    (query: string) => {
      const engines = {
        google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
      }
      return engines[settings.searchEngine]
    },
    [settings.searchEngine],
  )

  const navigateToUrl = useCallback(
    (url: string, targetTabId?: string) => {
      const tabId = targetTabId || activeTabId
      let finalUrl = url

      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("orbit://")) {
        if (url.includes(".") && !url.includes(" ")) {
          finalUrl = `https://${url}`
        } else {
          finalUrl = getSearchUrl(url)
        }
      }

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === tabId) {
            const newHistory = [...tab.historyStack.slice(0, tab.historyIndex + 1), finalUrl]
            return {
              ...tab,
              url: finalUrl,
              title: finalUrl.replace(/^https?:\/\//, "").split("/")[0],
              isLoading: true,
              historyStack: newHistory,
              historyIndex: newHistory.length - 1,
            }
          }
          return tab
        }),
      )

      if (finalUrl !== "orbit://newtab" && !finalUrl.startsWith("orbit://")) {
        setHistory((prev) => [
          {
            title: finalUrl.replace(/^https?:\/\//, "").split("/")[0],
            url: finalUrl,
            time: new Date(),
          },
          ...prev.slice(0, 99),
        ])
      }

      setTimeout(() => {
        setTabs((prev) =>
          prev.map((tab) => {
            if (tab.id === tabId) {
              return { ...tab, isLoading: false }
            }
            return tab
          }),
        )
      }, 800)
    },
    [activeTabId, getSearchUrl],
  )

  const handleNavigateWithIncognito = useCallback(
    (url: string, targetTabId?: string) => {
      navigateToUrl(url, targetTabId)
      // In incognito mode, don't save to history
      if (!incognitoMode) {
        // History is already saved in navigateToUrl
      }
    },
    [navigateToUrl, incognitoMode],
  )

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }, [])

  const goBack = useCallback(
    (targetTabId?: string) => {
      const tabId = targetTabId || activeTabId
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === tabId && tab.historyIndex > 0) {
            const newIndex = tab.historyIndex - 1
            return {
              ...tab,
              url: tab.historyStack[newIndex],
              title: tab.historyStack[newIndex].replace(/^https?:\/\//, "").split("/")[0],
              historyIndex: newIndex,
            }
          }
          return tab
        }),
      )
    },
    [activeTabId],
  )

  const goForward = useCallback(
    (targetTabId?: string) => {
      const tabId = targetTabId || activeTabId
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === tabId && tab.historyIndex < tab.historyStack.length - 1) {
            const newIndex = tab.historyIndex + 1
            return {
              ...tab,
              url: tab.historyStack[newIndex],
              title: tab.historyStack[newIndex].replace(/^https?:\/\//, "").split("/")[0],
              historyIndex: newIndex,
            }
          }
          return tab
        }),
      )
    },
    [activeTabId],
  )

  const refresh = useCallback(
    (targetTabId?: string) => {
      const tabId = targetTabId || activeTabId
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === tabId) {
            return { ...tab, isLoading: true }
          }
          return tab
        }),
      )
      setTimeout(() => {
        setTabs((prev) =>
          prev.map((tab) => {
            if (tab.id === tabId) {
              return { ...tab, isLoading: false }
            }
            return tab
          }),
        )
      }, 800)
    },
    [activeTabId],
  )

  const addBookmark = useCallback(() => {
    if (activeTab.url !== "orbit://newtab") {
      const exists = bookmarks.some((b) => b.url === activeTab.url)
      if (!exists) {
        const newBookmark: Bookmark = {
          id: Date.now().toString(),
          title: activeTab.title,
          url: activeTab.url,
        }
        setBookmarks((prev) => [...prev, newBookmark])
      }
    }
  }, [activeTab, bookmarks])

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const addDownload = useCallback((download: Omit<Download, "id" | "progress" | "status" | "startedAt">) => {
    const newDownload: Download = {
      ...download,
      id: Date.now().toString(),
      progress: 0,
      status: "downloading",
      startedAt: new Date(),
    }
    setDownloads((prev) => [newDownload, ...prev])

    const interval = setInterval(() => {
      setDownloads((prev) =>
        prev.map((d) => {
          if (d.id === newDownload.id && d.status === "downloading") {
            const newProgress = Math.min(d.progress + Math.random() * 15, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              return { ...d, progress: 100, status: "completed" }
            }
            return { ...d, progress: newProgress }
          }
          return d
        }),
      )
    }, 500)
  }, [])

  const updateSettings = useCallback((newSettings: Partial<BrowserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  const toggleSplitView = useCallback(() => {
    if (splitView) {
      setSplitView(false)
      setSplitTabId(null)
    } else if (tabs.length > 1) {
      const otherTab = tabs.find((t) => t.id !== activeTabId)
      if (otherTab) {
        setSplitView(true)
        setSplitTabId(otherTab.id)
      }
    }
  }, [splitView, tabs, activeTabId])

  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url)
  const canGoBack = activeTab.historyIndex > 0
  const canGoForward = activeTab.historyIndex < activeTab.historyStack.length - 1

  const contentRef = useGestureControls({
    onSwipeLeft: goForward,
    onSwipeRight: goBack,
    onSwipeDown: refresh,
  })

  return (
    <BrowserContext.Provider value={{ settings, updateSettings, downloads, addDownload, translate, user }}>
      <div className="flex h-full w-full flex-col bg-background">
        {incognitoMode && (
          <div className="flex items-center justify-center border-b border-border bg-muted/50 py-2">
            <IncognitoIndicator />
          </div>
        )}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={setActiveTabId}
          onTabClose={closeTab}
          onNewTab={handleCreateNewTab}
          onReorderTabs={reorderTabs}
        />
        <BrowserToolbar
          url={activeTab.url}
          isLoading={activeTab.isLoading}
          onNavigate={incognitoMode ? handleNavigateWithIncognito : navigateToUrl}
          onBack={goBack}
          onForward={goForward}
          onRefresh={refresh}
          onHome={() => navigateToUrl(settings.homePage)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onAddBookmark={addBookmark}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenDownloads={() => setDownloadsOpen(true)}
          onToggleSplitView={toggleSplitView}
          onToggleDeviceEmulation={() => setDeviceEmulationEnabled((prev) => !prev)}
          onOpenAuth={() => setAuthOpen(true)}
          onOpenTranslate={() => setTranslateOpen(true)}
          onOpenFileViewer={() => setFileViewerOpen(true)}
          onOpenDevTools={() => setDevToolsOpen(!devToolsOpen)}
          onOpenPasswordManager={() => setPasswordManagerOpen(true)}
          onToggleReadingMode={() => setReadingModeOpen(!readingModeOpen)}
          onToggleIncognito={() => setIncognitoMode(!incognitoMode)}
          onToggleFullscreen={toggleFullscreen}
          isBookmarked={isBookmarked}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          splitView={splitView}
          downloadsCount={downloads.filter((d) => d.status === "downloading").length}
          deviceEmulationEnabled={deviceEmulationEnabled}
          incognitoMode={incognitoMode}
          devToolsOpen={devToolsOpen}
          readingModeOpen={readingModeOpen}
          fullscreen={fullscreen}
          user={user}
          onOpenExtensions={() => setExtensionsOpen(true)}
          onOpenAdBlocker={() => setAdBlockerOpen(true)}
          onOpenPerformanceMonitor={() => setPerformanceMonitorOpen(true)}
          onOpenScreenRecorder={() => setScreenRecorderOpen(true)}
          onOpenTabGroups={() => setTabGroupsOpen(true)}
          onOpenSessionManager={() => setSessionManagerOpen(true)}
          onOpenAIAssistant={() => setAIAssistantOpen(true)}
          onOpenCloudSync={() => setCloudSyncOpen(true)}
          onOpenQRGenerator={() => setQRGeneratorOpen(true)}
          onOpenPageAnnotations={() => setAnnotationsOpen(true)}
          onOpenRSSReader={() => setRSSReaderOpen(true)}
          onOpenWorkspaceManager={() => setWorkspaceManagerOpen(true)}
          onOpenPageAnalyzer={() => setPageAnalyzerOpen(true)}
          onOpenSmartBookmarks={() => setSmartBookmarksOpen(true)}
          onOpenAPIHub={() => setAPIHubOpen(true)}
        />

        {settings.showBookmarksBar && (
          <div className="flex h-8 items-center gap-1 border-b border-border bg-secondary/50 px-2">
            {bookmarks.slice(0, 8).map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => navigateToUrl(bookmark.url)}
                className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/20 text-[8px] font-bold text-primary">
                  {bookmark.title.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[80px] truncate">{bookmark.title}</span>
              </button>
            ))}
          </div>
        )}

        {deviceEmulationEnabled && (
          <DeviceEmulator
            currentDevice={currentDevice}
            isRotated={isRotated}
            onDeviceChange={setCurrentDevice}
            onRotate={() => setIsRotated((prev) => !prev)}
            onClose={() => setDeviceEmulationEnabled(false)}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            bookmarks={bookmarks}
            history={history}
            onNavigate={navigateToUrl}
            onRemoveBookmark={removeBookmark}
            onClearHistory={() => setHistory([])}
          />

          <div ref={contentRef} className="flex flex-1 items-center justify-center overflow-hidden bg-muted/30">
            <div
              className="flex overflow-hidden transition-all duration-300"
              style={{
                width:
                  deviceEmulationEnabled && currentDevice && currentDevice.width > 0
                    ? isRotated
                      ? currentDevice.height
                      : currentDevice.width
                    : "100%",
                height:
                  deviceEmulationEnabled && currentDevice && currentDevice.height > 0
                    ? isRotated
                      ? currentDevice.width
                      : currentDevice.height
                    : "100%",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <div
                className={`flex flex-1 overflow-hidden ${
                  deviceEmulationEnabled && currentDevice && currentDevice.width > 0
                    ? "rounded-3xl border-4 border-foreground/20 shadow-2xl"
                    : ""
                }`}
              >
                <BrowserContent
                  url={activeTab.url}
                  isLoading={activeTab.isLoading}
                  bookmarks={bookmarks}
                  onNavigate={navigateToUrl}
                  onDownload={addDownload}
                  className={splitView ? "w-1/2 border-r border-border" : "flex-1"}
                  deviceType={currentDevice?.type}
                />
                {splitView && splitTab && (
                  <BrowserContent
                    url={splitTab.url}
                    isLoading={splitTab.isLoading}
                    bookmarks={bookmarks}
                    onNavigate={(url) => navigateToUrl(url, splitTab.id)}
                    onDownload={addDownload}
                    className="w-1/2"
                    deviceType={currentDevice?.type}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <DownloadsPanel isOpen={downloadsOpen} onClose={() => setDownloadsOpen(false)} />
        <AuthPanel isOpen={authOpen} onClose={() => setAuthOpen(false)} onLogin={setUser} />
        <TranslatePanel isOpen={translateOpen} onClose={() => setTranslateOpen(false)} currentUrl={activeTab.url} />
        <FileViewer isOpen={fileViewerOpen} onClose={() => setFileViewerOpen(false)} />
        <DeveloperToolsPanel isOpen={devToolsOpen} onClose={() => setDevToolsOpen(false)} currentUrl={activeTab.url} />
        <PasswordManagerPanel isOpen={passwordManagerOpen} onClose={() => setPasswordManagerOpen(false)} />
        {readingModeOpen && (
          <ReadingMode isOpen={readingModeOpen} onClose={() => setReadingModeOpen(false)} url={activeTab.url} />
        )}
        <ExtensionsPanel isOpen={extensionsOpen} onClose={() => setExtensionsOpen(false)} />
        <AdBlockerPanel isOpen={adBlockerOpen} onClose={() => setAdBlockerOpen(false)} />
        <PerformanceMonitorPanel isOpen={performanceMonitorOpen} onClose={() => setPerformanceMonitorOpen(false)} />
        <ScreenRecorderPanel isOpen={screenRecorderOpen} onClose={() => setScreenRecorderOpen(false)} />
        <TabGroupsPanel
          isOpen={tabGroupsOpen}
          onClose={() => setTabGroupsOpen(false)}
          tabs={tabs}
          onUpdateTabs={setTabs}
        />
        <SessionManagerPanel
          isOpen={sessionManagerOpen}
          onClose={() => setSessionManagerOpen(false)}
          tabs={tabs}
          bookmarks={bookmarks}
          onRestoreTabs={setTabs}
        />
        <AIAssistantPanel
          isOpen={aiAssistantOpen}
          onClose={() => setAIAssistantOpen(false)}
          currentUrl={activeTab.url}
          onNavigate={navigateToUrl}
        />
        <CloudSyncPanel isOpen={cloudSyncOpen} onClose={() => setCloudSyncOpen(false)} user={user} />
        <QRGeneratorPanel isOpen={qrGeneratorOpen} onClose={() => setQRGeneratorOpen(false)} url={activeTab.url} />
        <PageAnnotationsPanel isOpen={annotationsOpen} onClose={() => setAnnotationsOpen(false)} url={activeTab.url} />
        <RSSReaderPanel isOpen={rssReaderOpen} onClose={() => setRSSReaderOpen(false)} onNavigate={navigateToUrl} />
        <WorkspaceManagerPanel isOpen={workspaceManagerOpen} onClose={() => setWorkspaceManagerOpen(false)} />
        <PageAnalyzerPanel
          isOpen={pageAnalyzerOpen}
          onClose={() => setPageAnalyzerOpen(false)}
          currentUrl={activeTab.url}
        />
        <SmartBookmarksPanel isOpen={smartBookmarksOpen} onClose={() => setSmartBookmarksOpen(false)} />
        <APIHubPanel isOpen={apiHubOpen} onClose={() => setAPIHubOpen(false)} />
      </div>
    </BrowserContext.Provider>
  )
}
