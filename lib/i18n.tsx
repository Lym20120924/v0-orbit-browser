"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Language = "en" | "zh" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh")

  const translate = (key: string) => t(key, language)

  return <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return fallback for components outside provider
    return {
      language: "zh" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }
  return context
}

export const languages = [
  { code: "en" as Language, name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "zh" as Language, name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja" as Language, name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko" as Language, name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "fr" as Language, name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de" as Language, name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "es" as Language, name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "ru" as Language, name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ar" as Language, name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
]

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Browser UI
    newTab: "New Tab",
    tabs: "Tabs",
    closeTab: "Close Tab",
    bookmarks: "Bookmarks",
    history: "History",
    downloads: "Downloads",
    settings: "Settings",
    search: "Search or enter URL",
    back: "Back",
    forward: "Forward",
    refresh: "Refresh",
    home: "Home",
    addBookmark: "Add Bookmark",
    removeBookmark: "Remove Bookmark",
    searchBookmarks: "Search bookmarks",

    // Settings
    searchEngine: "Search Engine",
    theme: "Theme",
    language: "Language",
    homePage: "Home Page",
    showBookmarksBar: "Show Bookmarks Bar",
    browsingMode: "Browsing Mode",
    safeMode: "Safe Mode",
    proxyMode: "Proxy Mode",
    autoRetry: "Auto Retry",
    soundEffects: "Sound Effects",

    // Translation
    translate: "Translate",
    translatePage: "Translate Page",
    from: "From",
    to: "To",
    autoDetect: "Auto Detect",
    translatedText: "Translated Text",
    inputText: "Input Text",
    outputText: "Output Text",
    translateWebpage: "Translate Webpage",
    translateDocument: "Translate Document",
    originalLanguage: "Original Language",
    translateTo: "Translate To",
    detectLanguage: "Detect Language",
    translated: "Translated",
    showOriginal: "Show Original",
    translating: "Translating...",
    autoTranslate: "Auto Translate",
    copy: "Copy",
    copied: "Copied!",

    // File Viewer
    fileViewer: "File Viewer",
    selectFile: "Select a file to view",
    dragDropFile: "Drag and drop a file here",
    openFile: "Open File",

    // Authentication
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    logout: "Logout",

    // Developer Tools
    developerTools: "Developer Tools",
    console: "Console",
    network: "Network",
    elements: "Elements",
    performance: "Performance",

    // Password Manager
    passwordManager: "Password Manager",
    savedPasswords: "Saved Passwords",
    addPassword: "Add Password",
    website: "Website",
    username: "Username",

    // Reading Mode
    readingMode: "Reading Mode",

    // Device Emulation
    deviceEmulation: "Device Emulation",
    selectDevice: "Select Device",
    rotate: "Rotate",

    // Extensions
    extensions: "Extensions",
    extensionStore: "Extension Store",
    installedExtensions: "Installed Extensions",
    install: "Install",
    uninstall: "Uninstall",
    enable: "Enable",
    disable: "Disable",

    // Ad Blocker
    adBlocker: "Ad Blocker",
    adsBlocked: "Ads Blocked",
    blockList: "Block List",
    allowList: "Allow List",
    addRule: "Add Rule",

    // Performance Monitor
    performanceMonitor: "Performance Monitor",
    cpuUsage: "CPU Usage",
    memoryUsage: "Memory Usage",
    fps: "FPS",
    networkSpeed: "Network Speed",

    // Screen Recorder
    screenRecorder: "Screen Recorder",
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    pauseRecording: "Pause Recording",
    resumeRecording: "Resume Recording",

    // Tab Groups
    tabGroups: "Tab Groups",
    createGroup: "Create Group",
    groupName: "Group Name",
    ungrouped: "Ungrouped",

    // Session Manager
    sessionManager: "Session Manager",
    currentSession: "Current Session",
    savedSessions: "Saved Sessions",
    saveSession: "Save Session",
    restoreSession: "Restore Session",
    deleteSession: "Delete Session",
    sessionName: "Session Name",

    // AI Assistant
    aiAssistant: "AI Assistant",
    askAnything: "Ask anything...",
    summarizePage: "Summarize Page",
    explainConcept: "Explain Concept",

    // Cloud Sync
    cloudSync: "Cloud Sync",
    syncEnabled: "Sync Enabled",
    enableSync: "Enable Sync",
    disableSync: "Disable Sync",
    syncNow: "Sync Now",
    lastSync: "Last Sync",

    // Page Annotations
    pageAnnotations: "Page Annotations",
    addNote: "Add Note",
    notes: "Notes",
    writeNote: "Write a note...",
    noNotes: "No notes yet",

    // QR Generator
    qrGenerator: "QR Code Generator",
    generateQR: "Generate QR Code",
    downloadQR: "Download QR Code",

    // RSS Reader
    rssReader: "RSS Reader",
    addFeed: "Add Feed",
    allFeeds: "All Feeds",
    articles: "Articles",
    noArticles: "No articles",
    unreadOnly: "Unread Only",
    showAll: "Show All",
    markAsRead: "Mark as Read",

    // Workspace Manager
    workspaceManager: "Workspace Manager",
    newWorkspace: "New Workspace",
    workspaceName: "Workspace Name",
    workspaceInfo: "Workspace Info",
    separateTabs: "Separate tabs for each workspace",
    separateBookmarks: "Separate bookmarks for each workspace",
    separateExtensions: "Separate extensions for each workspace",
    quickSwitch: "Quick switch between workspaces",

    // Page Analyzer
    pageAnalyzer: "Page Analyzer",
    analyzePage: "Analyze Page",
    seoScore: "SEO Score",
    accessibilityScore: "Accessibility Score",
    performanceScore: "Performance Score",
    issues: "Issues",
    suggestions: "Suggestions",

    // Smart Bookmarks
    smartBookmarks: "Smart Bookmarks",
    allBookmarks: "All Bookmarks",
    collections: "Collections",
    tags: "Tags",
    addCollection: "Add Collection",

    // API Hub
    apiHub: "API Hub",
    freeApis: "Free APIs",
    tryApi: "Try API",
    apiCategories: "Categories",
    weather: "Weather",
    jokes: "Jokes",
    quotes: "Quotes",
    facts: "Facts",
    images: "Images",
    animals: "Animals",
    food: "Food",
    music: "Music",
    movies: "Movies",
    books: "Books",
    news: "News",
    sports: "Sports",
    science: "Science",
    games: "Games",
    utilities: "Utilities",
    moreTools: "More Tools",
    incognitoMode: "Incognito Mode",
    fullscreen: "Fullscreen",
    searchOrEnterUrl: "Search or enter URL",

    // AI Chat
    aiChat: "AI Chat",
    newConversation: "New Conversation",
    conversations: "Conversations",
    systemPrompt: "System Prompt",
    sendMessage: "Send Message",
    stopGenerating: "Stop Generating",
    regenerate: "Regenerate",
    copyMessage: "Copy Message",
    editMessage: "Edit Message",
    exportConversation: "Export Conversation",
    importConversation: "Import Conversation",
    clearAllData: "Clear All Data",
    voiceInput: "Voice Input",
    voiceOutput: "Voice Output",
    searchConversations: "Search Conversations",

    // Common
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    ok: "OK",
    apply: "Apply",
    reset: "Reset",
    clear: "Clear",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
  },

  zh: {
    // 浏览器界面
    newTab: "新标签页",
    tabs: "标签页",
    closeTab: "关闭标签",
    bookmarks: "书签",
    history: "历史记录",
    downloads: "下载",
    settings: "设置",
    search: "搜索或输入网址",
    back: "后退",
    forward: "前进",
    refresh: "刷新",
    home: "主页",
    addBookmark: "添加书签",
    removeBookmark: "移除书签",
    searchBookmarks: "搜索书签",

    // 设置
    searchEngine: "搜索引擎",
    theme: "主题",
    language: "语言",
    homePage: "主页",
    showBookmarksBar: "显示书签栏",
    browsingMode: "浏览模式",
    safeMode: "安全模式",
    proxyMode: "代理模式",
    autoRetry: "自动重试",
    soundEffects: "音效",

    // 翻译
    translate: "翻译",
    translatePage: "翻译页面",
    from: "从",
    to: "到",
    autoDetect: "自动检测",
    translatedText: "译文",
    inputText: "输入文本",
    outputText: "输出文本",
    translateWebpage: "翻译网页",
    translateDocument: "翻译文档",
    originalLanguage: "原始语言",
    translateTo: "翻译为",
    detectLanguage: "检测语言",
    translated: "已翻译",
    showOriginal: "显示原文",
    translating: "翻译中...",
    autoTranslate: "自动翻译",
    copy: "复制",
    copied: "已复制！",

    // 文件查看器
    fileViewer: "文件查看器",
    selectFile: "选择要查看的文件",
    dragDropFile: "拖放文件到这里",
    openFile: "打开文件",

    // 认证
    login: "登录",
    register: "注册",
    email: "邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    logout: "退出登录",

    // 开发者工具
    developerTools: "开发者工具",
    console: "控制台",
    network: "网络",
    elements: "元素",
    performance: "性能",

    // 密码管理器
    passwordManager: "密码管理器",
    savedPasswords: "已保存密码",
    addPassword: "添加密码",
    website: "网站",
    username: "用户名",

    // 阅读模式
    readingMode: "阅读模式",

    // 设备模拟
    deviceEmulation: "设备模拟",
    selectDevice: "选择设备",
    rotate: "旋转",

    // 扩展
    extensions: "扩展",
    extensionStore: "扩展商店",
    installedExtensions: "已安装扩展",
    install: "安装",
    uninstall: "卸载",
    enable: "启用",
    disable: "禁用",

    // 广告拦截器
    adBlocker: "广告拦截器",
    adsBlocked: "已拦截广告",
    blockList: "拦截列表",
    allowList: "允许列表",
    addRule: "添加规则",

    // 性能监控
    performanceMonitor: "性能监控",
    cpuUsage: "CPU使用率",
    memoryUsage: "内存使用",
    fps: "帧率",
    networkSpeed: "网络速度",

    // 屏幕录制
    screenRecorder: "屏幕录制",
    startRecording: "开始录制",
    stopRecording: "停止录制",
    pauseRecording: "暂停录制",
    resumeRecording: "继续录制",

    // 标签组
    tabGroups: "标签组",
    createGroup: "创建组",
    groupName: "组名",
    ungrouped: "未分组",

    // 会话管理器
    sessionManager: "会话管理器",
    currentSession: "当前会话",
    savedSessions: "已保存会话",
    saveSession: "保存会话",
    restoreSession: "恢复会话",
    deleteSession: "删除会话",
    sessionName: "会话名",

    // AI助手
    aiAssistant: "AI助手",
    askAnything: "问我任何问题...",
    summarizePage: "总结页面",
    explainConcept: "解释概念",

    // 云同步
    cloudSync: "云同步",
    syncEnabled: "同步已启用",
    enableSync: "启用同步",
    disableSync: "禁用同步",
    syncNow: "立即同步",
    lastSync: "上次同步",

    // 页面注释
    pageAnnotations: "页面注释",
    addNote: "添加笔记",
    notes: "笔记",
    writeNote: "写笔记...",
    noNotes: "还没有笔记",

    // 二维码生成器
    qrGenerator: "二维码生成器",
    generateQR: "生成二维码",
    downloadQR: "下载二维码",

    // RSS阅读器
    rssReader: "RSS阅读器",
    addFeed: "添加订阅源",
    allFeeds: "所有订阅源",
    articles: "文章",
    noArticles: "没有文章",
    unreadOnly: "仅未读",
    showAll: "显示全部",
    markAsRead: "标记为已读",

    // 工作区管理器
    workspaceManager: "工作区管理器",
    newWorkspace: "新工作区",
    workspaceName: "工作区名称",
    workspaceInfo: "工作区信息",
    separateTabs: "每个工作区独立的标签页",
    separateBookmarks: "每个工作区独立的书签",
    separateExtensions: "每个工作区独立的扩展",
    quickSwitch: "快速切换工作区",

    // 页面分析器
    pageAnalyzer: "页面分析器",
    analyzePage: "分析页面",
    seoScore: "SEO评分",
    accessibilityScore: "可访问性评分",
    performanceScore: "性能评分",
    issues: "问题",
    suggestions: "建议",

    // 智能书签
    smartBookmarks: "智能书签",
    allBookmarks: "所有书签",
    collections: "集合",
    tags: "标签",
    addCollection: "添加集合",

    // API中心
    apiHub: "API中心",
    freeApis: "免费API",
    tryApi: "测试API",
    apiCategories: "分类",
    weather: "天气",
    jokes: "笑话",
    quotes: "名言",
    facts: "事实",
    images: "图片",
    animals: "动物",
    food: "食物",
    music: "音乐",
    movies: "电影",
    books: "书籍",
    news: "新闻",
    sports: "体育",
    science: "科学",
    games: "游戏",
    utilities: "工具",
    moreTools: "更多工具",
    incognitoMode: "无痕模式",
    fullscreen: "全屏",
    searchOrEnterUrl: "搜索或输入网址",

    // AI对话
    aiChat: "AI对话",
    newConversation: "新建对话",
    conversations: "对话列表",
    systemPrompt: "系统提示词",
    sendMessage: "发送消息",
    stopGenerating: "停止生成",
    regenerate: "重新生成",
    copyMessage: "复制消息",
    editMessage: "编辑消息",
    exportConversation: "导出对话",
    importConversation: "导入对话",
    clearAllData: "清除所有数据",
    voiceInput: "语音输入",
    voiceOutput: "语音播报",
    searchConversations: "搜索对话",

    // 通用
    close: "关闭",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    create: "创建",
    update: "更新",
    confirm: "确认",
    yes: "是",
    no: "否",
    ok: "确定",
    apply: "应用",
    reset: "重置",
    clear: "清除",
    loading: "加载中...",
    error: "错误",
    success: "成功",
    warning: "警告",
    info: "信息",
  },

  ja: {
    newTab: "新しいタブ",
    tabs: "タブ",
    bookmarks: "ブックマーク",
    history: "履歴",
    downloads: "ダウンロード",
    settings: "設定",
    search: "検索またはURLを入力",
    translate: "翻訳",
    fileViewer: "ファイルビューアー",
    login: "ログイン",
    close: "閉じる",
  },

  ko: {
    newTab: "새 탭",
    tabs: "탭",
    bookmarks: "북마크",
    history: "기록",
    downloads: "다운로드",
    settings: "설정",
    search: "검색 또는 URL 입력",
    translate: "번역",
    fileViewer: "파일 뷰어",
    login: "로그인",
    close: "닫기",
  },

  fr: {
    newTab: "Nouvel onglet",
    tabs: "Onglets",
    bookmarks: "Favoris",
    history: "Historique",
    downloads: "Téléchargements",
    settings: "Paramètres",
    search: "Rechercher ou saisir une URL",
    translate: "Traduire",
    fileViewer: "Visionneuse de fichiers",
    login: "Connexion",
    close: "Fermer",
  },

  de: {
    newTab: "Neuer Tab",
    tabs: "Tabs",
    bookmarks: "Lesezeichen",
    history: "Verlauf",
    downloads: "Downloads",
    settings: "Einstellungen",
    search: "Suchen oder URL eingeben",
    translate: "Übersetzen",
    fileViewer: "Dateibetrachter",
    login: "Anmelden",
    close: "Schließen",
  },

  es: {
    newTab: "Nueva pestaña",
    tabs: "Pestañas",
    bookmarks: "Marcadores",
    history: "Historial",
    downloads: "Descargas",
    settings: "Configuración",
    search: "Buscar o introducir URL",
    translate: "Traducir",
    fileViewer: "Visor de archivos",
    login: "Iniciar sesión",
    close: "Cerrar",
  },

  ru: {
    newTab: "Новая вкладка",
    tabs: "Вкладки",
    bookmarks: "Закладки",
    history: "История",
    downloads: "Загрузки",
    settings: "Настройки",
    search: "Поиск или введите URL",
    translate: "Перевести",
    fileViewer: "Просмотр файлов",
    login: "Войти",
    close: "Закрыть",
  },

  ar: {
    newTab: "علامة تبويب جديدة",
    tabs: "علامات التبويب",
    bookmarks: "الإشارات المرجعية",
    history: "السجل",
    downloads: "التنزيلات",
    settings: "الإعدادات",
    search: "البحث أو إدخال عنوان URL",
    translate: "ترجمة",
    fileViewer: "عارض الملفات",
    login: "تسجيل الدخول",
    close: "إغلاق",
  },
}

export function t(key: string, language: Language): string {
  return translations[language]?.[key] || translations["en"]?.[key] || key
}
