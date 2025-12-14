"use client"

import { useState } from "react"
import { X, Languages, Check, RefreshCw, Copy, ArrowLeftRight, FileText, Globe, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { languages, type Language } from "@/lib/i18n"

interface TranslatePanelProps {
  isOpen: boolean
  onClose: () => void
  currentUrl: string
}

// 模拟翻译示例文本
const sampleTexts: Record<Language, string> = {
  zh: "欢迎使用 Orbit Browser，这是一款快速、安全、现代的浏览器。它支持多语言翻译、文件查看和设备模拟等功能。",
  en: "Welcome to Orbit Browser, a fast, secure, and modern browser. It supports multi-language translation, file viewing, and device emulation features.",
  ja: "Orbit Browserへようこそ。高速で安全、そしてモダンなブラウザです。多言語翻訳、ファイル閲覧、デバイスエミュレーションなどの機能をサポートしています。",
  ko: "Orbit Browser에 오신 것을 환영합니다. 빠르고 안전하며 현대적인 브라우저입니다. 다국어 번역, 파일 보기, 기기 에뮬레이션 기능을 지원합니다.",
  fr: "Bienvenue sur Orbit Browser, un navigateur rapide, sécurisé et moderne. Il prend en charge la traduction multilingue, la visualisation de fichiers et l'émulation d'appareils.",
  de: "Willkommen bei Orbit Browser, einem schnellen, sicheren und modernen Browser. Er unterstützt mehrsprachige Übersetzung, Dateianzeige und Geräteemulation.",
  es: "Bienvenido a Orbit Browser, un navegador rápido, seguro y moderno. Admite traducción multilingüe, visualización de archivos y emulación de dispositivos.",
  ru: "Добро пожаловать в Orbit Browser — быстрый, безопасный и современный браузер. Он поддерживает многоязычный перевод, просмотр файлов и эмуляцию устройств.",
  ar: "مرحبًا بك في Orbit Browser، متصفح سريع وآمن وحديث. يدعم الترجمة متعددة اللغات وعرض الملفات ومحاكاة الأجهزة.",
}

export function TranslatePanel({ isOpen, onClose, currentUrl }: TranslatePanelProps) {
  const { translate, settings } = useBrowser()
  const [activeTab, setActiveTab] = useState<"page" | "text" | "document">("text")
  const [sourceLanguage, setSourceLanguage] = useState<Language | "auto">("auto")
  const [targetLanguage, setTargetLanguage] = useState<Language>(settings.language)
  const [isTranslating, setIsTranslating] = useState(false)
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [copied, setCopied] = useState(false)

  const [pageTranslated, setPageTranslated] = useState(false)

  if (!isOpen) return null

  const handleTranslate = async () => {
    if (!inputText.trim() && activeTab === "text") return

    setIsTranslating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

    if (activeTab === "text") {
      // 模拟翻译 - 实际应用中应调用翻译 API
      setOutputText(sampleTexts[targetLanguage] || inputText)
    } else if (activeTab === "page") {
      setPageTranslated(true)
    }

    setIsTranslating(false)
  }

  const handleSwapLanguages = () => {
    if (sourceLanguage !== "auto") {
      const temp = sourceLanguage
      setSourceLanguage(targetLanguage)
      setTargetLanguage(temp)
      // Swap text too
      const tempText = inputText
      setInputText(outputText)
      setOutputText(tempText)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShowOriginal = () => {
    setPageTranslated(false)
    setOutputText("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("translate")}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-border">
          {[
            { id: "text" as const, label: translate("inputText"), icon: Languages },
            { id: "page" as const, label: translate("translateWebpage"), icon: Globe },
            { id: "document" as const, label: translate("translateDocument"), icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Language Selection */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                {translate("originalLanguage")}
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value as Language | "auto")}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="auto">{translate("detectLanguage")}</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwapLanguages}
              disabled={sourceLanguage === "auto"}
              className={cn(
                "mt-6 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                sourceLanguage === "auto"
                  ? "cursor-not-allowed text-muted-foreground/30"
                  : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">{translate("translateTo")}</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as Language)}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeTab === "text" && (
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-2 text-xs font-medium text-muted-foreground">{translate("inputText")}</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={translate("inputText") + "..."}
                  className="h-40 w-full resize-none rounded-xl border border-border bg-secondary p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">{translate("outputText")}</label>
                  {outputText && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? translate("copied") : translate("copy")}
                    </button>
                  )}
                </div>
                <div className="relative h-40 w-full rounded-xl border border-border bg-muted/50 p-4">
                  {outputText ? (
                    <p className="text-sm text-foreground">{outputText}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">{translate("outputText")}...</p>
                  )}
                  {isTranslating && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "page" && (
            <div className="mb-6 rounded-xl border border-border bg-secondary/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{translate("translateWebpage")}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUrl === "orbit://newtab" ? "New Tab" : currentUrl.replace(/^https?:\/\//, "").split("/")[0]}
                  </p>
                </div>
              </div>
              {pageTranslated && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent/10 p-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm text-accent">{translate("translated")}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "document" && (
            <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 font-medium text-foreground">{translate("translateDocument")}</p>
              <p className="mb-4 text-sm text-muted-foreground">PDF, Word, Excel, TXT, Markdown</p>
              <button className="rounded-xl bg-secondary px-6 py-2 text-sm font-medium text-foreground hover:bg-secondary/80">
                {translate("openFile")}
              </button>
            </div>
          )}

          {/* Auto Translate Toggle */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{translate("autoTranslate")}</p>
                <p className="text-sm text-muted-foreground">
                  {settings.language === "zh" ? "自动翻译非当前语言的页面" : "Auto translate pages in other languages"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                autoTranslate ? "bg-primary" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  autoTranslate ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {pageTranslated && activeTab === "page" ? (
              <button
                onClick={handleShowOriginal}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
              >
                {translate("showOriginal")}
              </button>
            ) : (
              <button
                onClick={handleTranslate}
                disabled={isTranslating || (activeTab === "text" && !inputText.trim())}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                  (isTranslating || (activeTab === "text" && !inputText.trim())) && "cursor-not-allowed opacity-50",
                )}
              >
                {isTranslating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {translate("translating")}
                  </>
                ) : (
                  <>
                    <Languages className="h-4 w-4" />
                    {translate("translate")}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-center text-xs text-muted-foreground">
            {settings.language === "zh"
              ? `支持 ${languages.length} 种语言互译`
              : `Supports translation between ${languages.length} languages`}
          </p>
        </div>
      </div>
    </div>
  )
}
