"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import {
  X,
  Upload,
  FileText,
  ImageIcon,
  Film,
  Music,
  Code,
  File,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Download,
  Languages,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Archive,
  Type,
  BookOpen,
  Box,
  PenTool,
  Table,
  Presentation,
  FolderOpen,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { getFileType, formatFileSize, fileTypes, type FileType } from "@/lib/file-types"
import { languages, type Language } from "@/lib/i18n"

interface FileViewerProps {
  isOpen: boolean
  onClose: () => void
}

interface LoadedFile {
  name: string
  size: number
  type: FileType
  url: string
  content?: string
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Image: ImageIcon,
  Film,
  Music,
  Code,
  File,
  Archive,
  Type,
  BookOpen,
  Box,
  PenTool,
  Table,
  Presentation,
}

export function FileViewer({ isOpen, onClose }: FileViewerProps) {
  const { translate, settings } = useBrowser()
  const [file, setFile] = useState<LoadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showTranslate, setShowTranslate] = useState(false)
  const [translateTo, setTranslateTo] = useState<Language>(settings.language)
  const [translatedContent, setTranslatedContent] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      loadFile(droppedFile)
    }
  }, [])

  const loadFile = async (inputFile: File) => {
    const fileType = getFileType(inputFile.name, inputFile.type)
    const url = URL.createObjectURL(inputFile)

    let content: string | undefined
    if (["code", "markdown", "text"].includes(fileType.type)) {
      content = await inputFile.text()
    }

    setFile({
      name: inputFile.name,
      size: inputFile.size,
      type: fileType,
      url,
      content,
    })
    setZoom(100)
    setRotation(0)
    setTranslatedContent(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      loadFile(selectedFile)
    }
  }

  const handleTranslateContent = async () => {
    if (!file?.content) return
    // 模拟翻译
    setTranslatedContent(`[${languages.find((l) => l.code === translateTo)?.nativeName}]\n\n${file.content}`)
  }

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || File
  }

  const categories = [
    { id: "all", label: translate("allFormats"), icon: FolderOpen },
    { id: "document", label: translate("document"), icon: FileText },
    { id: "media", label: translate("video"), icon: Film },
    { id: "code", label: translate("code"), icon: Code },
    { id: "archive", label: translate("archive"), icon: Archive },
    { id: "design", label: translate("vector"), icon: PenTool },
    { id: "3d", label: translate("model3d"), icon: Box },
  ]

  const getFileTypesByCategory = () => {
    if (activeCategory === "all") {
      return fileTypes
    }
    return fileTypes.filter((ft) => ft.category === activeCategory)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("fileViewer")}</h2>
            {file && (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{file.name}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {!file ? (
            // Upload Area with categories
            <div className="flex flex-1">
              <div className="w-48 border-r border-border bg-secondary/30 p-3">
                <p className="mb-3 px-2 text-xs font-medium text-muted-foreground">{translate("supportedFormats")}</p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload area */}
              <div
                className={cn("flex flex-1 flex-col items-center justify-center p-8", isDragging && "bg-primary/5")}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div
                  className={cn(
                    "flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors",
                    isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className={cn("mb-4 h-12 w-12", isDragging ? "text-primary" : "text-muted-foreground")} />
                  <p className="mb-2 text-lg font-medium text-foreground">{translate("dragDropFile")}</p>
                  <p className="mb-6 text-sm text-muted-foreground">{translate("supportedFormats")}</p>

                  <div className="flex max-h-32 flex-wrap justify-center gap-2 overflow-y-auto">
                    {getFileTypesByCategory().map((ft) => {
                      const IconComponent = getIconComponent(ft.icon)
                      return (
                        <div key={ft.type} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br",
                              ft.color,
                            )}
                          >
                            <IconComponent className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-xs text-muted-foreground">{ft.type}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="*/*" />
              </div>
            </div>
          ) : (
            // File Preview
            <div className="flex flex-1 flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br",
                      file.type.color,
                    )}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(file.type.icon)
                      return <IconComponent className="h-4 w-4 text-white" />
                    })()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type.type.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {file.type.type === "image" && (
                    <>
                      <button
                        onClick={() => setZoom(Math.max(25, zoom - 25))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <span className="min-w-[3rem] text-center text-xs text-muted-foreground">{zoom}%</span>
                      <button
                        onClick={() => setZoom(Math.min(200, zoom + 25))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setRotation((rotation + 90) % 360)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {(file.type.type === "video" || file.type.type === "audio") && (
                    <>
                      <button
                        onClick={() => {
                          const media = file.type.type === "video" ? videoRef.current : audioRef.current
                          if (media) {
                            if (isPlaying) media.pause()
                            else media.play()
                            setIsPlaying(!isPlaying)
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    </>
                  )}

                  {["code", "markdown", "text"].includes(file.type.type) && (
                    <button
                      onClick={() => setShowTranslate(!showTranslate)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary",
                        showTranslate ? "text-primary" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Languages className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => window.open(file.url, "_blank")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>

                  <a
                    href={file.url}
                    download={file.name}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => {
                      setFile(null)
                      setTranslatedContent(null)
                    }}
                    className="ml-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80"
                  >
                    {translate("openFile")}
                  </button>
                </div>
              </div>

              {/* Translation Bar */}
              {showTranslate && ["code", "markdown", "text"].includes(file.type.type) && (
                <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-4 py-2">
                  <Languages className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{translate("translateTo")}:</span>
                  <select
                    value={translateTo}
                    onChange={(e) => setTranslateTo(e.target.value as Language)}
                    className="rounded-lg border border-border bg-secondary px-2 py-1 text-sm text-foreground"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.nativeName}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleTranslateContent}
                    className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {translate("translate")}
                  </button>
                  {translatedContent && (
                    <button
                      onClick={() => setTranslatedContent(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {translate("showOriginal")}
                    </button>
                  )}
                </div>
              )}

              {/* Preview Area */}
              <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/30 p-4">
                {file.type.type === "image" && (
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt={file.name}
                    className="max-h-full max-w-full object-contain transition-transform"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    }}
                  />
                )}

                {file.type.type === "video" && (
                  <video
                    ref={videoRef}
                    src={file.url}
                    controls
                    muted={isMuted}
                    className="max-h-full max-w-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                )}

                {file.type.type === "audio" && (
                  <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-card p-8">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
                      <Music className="h-16 w-16 text-white" />
                    </div>
                    <p className="text-lg font-medium text-foreground">{file.name}</p>
                    <audio
                      ref={audioRef}
                      src={file.url}
                      controls
                      muted={isMuted}
                      className="w-full"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                )}

                {file.type.type === "pdf" && (
                  <iframe src={file.url} className="h-full w-full rounded-lg border border-border" />
                )}

                {["code", "markdown", "text", "json", "xml", "yaml"].includes(file.type.type) && (
                  <div className="h-full w-full overflow-auto rounded-lg border border-border bg-card">
                    {file.content ? (
                      <pre className="p-4 text-sm font-mono text-foreground whitespace-pre-wrap break-words">
                        <code className="text-xs leading-relaxed">
                          {translatedContent || file.content}
                        </code>
                      </pre>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">{translate("noContent")}</p>
                      </div>
                    )}
                  </div>
                )}

                {file.type.type === "spreadsheet" && (
                  <div className="h-full w-full overflow-auto rounded-lg border border-border bg-card p-4">
                    <div className="inline-block min-w-full border border-border rounded-lg">
                      <table className="text-xs">
                        <tbody>
                          <tr>
                            <td className="border border-border px-3 py-2 bg-secondary">Spreadsheet Content</td>
                          </tr>
                          <tr>
                            <td className="border border-border px-3 py-2 text-muted-foreground">
                              {translate("fileOpen")} - {file.name}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {file.type.type === "archive" && (
                  <div className="h-full w-full overflow-auto rounded-lg border border-border bg-card p-4">
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">{translate("archiveContent")} - {file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                )}

                {!["image", "video", "audio", "pdf", "code", "markdown", "text", "json", "xml", "yaml", "spreadsheet", "archive"].includes(file.type.type) && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">
                      <File className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-foreground font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground mt-2">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{translate("previewNotAvailable")}</p>
                    </div>
                  </div>
                )}

                {file.type.type === "archive" && (
                  <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <Archive className="h-10 w-10 text-amber-500" />
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">{translate("fileList")}</p>
                    <div className="rounded-lg border border-border bg-secondary/50 p-3">
                      <div className="flex items-center gap-2 py-1">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">document.pdf</span>
                      </div>
                      <div className="flex items-center gap-2 py-1">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">images/</span>
                      </div>
                      <div className="flex items-center gap-2 py-1">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">readme.txt</span>
                      </div>
                    </div>
                  </div>
                )}

                {file.type.type === "model3d" && (
                  <div className="flex flex-col items-center gap-4">
                    <Box className="h-24 w-24 text-cyan-500" />
                    <p className="text-lg font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{translate("model3d")}</p>
                  </div>
                )}

                {file.type.type === "font" && (
                  <div className="flex flex-col items-center gap-4">
                    <Type className="h-24 w-24 text-indigo-500" />
                    <p className="font-medium text-foreground">{file.name}</p>
                    <div className="text-center">
                      <p className="text-4xl">Aa Bb Cc</p>
                      <p className="mt-2 text-2xl text-muted-foreground">0123456789</p>
                    </div>
                  </div>
                )}

                {file.type.type === "ebook" && (
                  <div className="flex flex-col items-center gap-4">
                    <BookOpen className="h-24 w-24 text-teal-500" />
                    <p className="text-lg font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{translate("ebook")}</p>
                  </div>
                )}

                {file.type.type === "unknown" && (
                  <div className="text-center">
                    <File className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground">{translate("unsupportedFile")}</p>
                    <p className="text-sm text-muted-foreground">{file.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
