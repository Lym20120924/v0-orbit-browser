"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  X, Send, Bot, User, Sparkles, Trash2, ChevronDown, Plus, Search, Settings,
  Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, Edit2, Download, Upload,
  MessageSquare, MoreVertical, Pin, Archive, Mic, MicOff, Volume2, VolumeX,
  Square, Maximize2, Minimize2
} from "lucide-react"
import { playSound } from "@/lib/sounds"
import { sendAIMessage, getAvailableModels, streamAIMessage, setDeepseekKey, getCurrentDeepseekKey, isDeepseekConfigured, type AIModel } from "@/lib/ai-api"
import {
  type Message, type Conversation, type ChatSettings,
  saveConversation, getConversation, getAllConversations, deleteConversation,
  clearAllConversations, searchConversations, saveSettings, getSettings,
  exportConversation, exportAllConversations, importConversations,
  generateId, generateTitle, estimateTokens
} from "@/lib/ai-chat-storage"
import { MarkdownRenderer } from "./markdown-renderer"

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  // Get available models
  const availableModels = getAvailableModels()
  // Set Deepseek V4 Pro as default, fallback to Deepseek Chat, then first available
  const defaultModel = availableModels.find(m => m.id === "deepseek-v4-pro") || 
                       availableModels.find(m => m.id === "deepseek-chat") || 
                       (availableModels.length > 0 ? availableModels[0] : null)

  // State
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(defaultModel)
  const [settings, setSettings] = useState<ChatSettings | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [apiKeyConfigured, setApiKeyConfigured] = useState(!!getCurrentDeepseekKey())
  const [apiError, setApiError] = useState<string | null>(null)
  const [useRapidAPI, setUseRapidAPI] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Initialize API key on mount
  useEffect(() => {
    const currentKey = getCurrentDeepseekKey()
    setApiKeyConfigured(!!currentKey && currentKey !== "")
    if (!currentKey || currentKey === "") {
      setShowApiKeyDialog(true)
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        handleNewConversation()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault()
        document.getElementById("chat-search")?.focus()
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Delete") {
        e.preventDefault()
        if (currentConversation) {
          handleClearConversation()
        }
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentConversation])

  const handleSaveApiKey = () => {
    if (apiKeyInput && apiKeyInput.startsWith("sk-")) {
      setDeepseekKey(apiKeyInput)
      setApiKeyConfigured(true)
      setShowApiKeyDialog(false)
      setApiKeyInput("")
      playSound("success")
    } else {
      alert("Please enter a valid Deepseek API key (starts with 'sk-')")
    }
  }

  const loadData = async () => {
    const [loadedConversations, loadedSettings] = await Promise.all([
      getAllConversations(),
      getSettings()
    ])
    setConversations(loadedConversations)
    setSettings(loadedSettings)
    if (loadedConversations.length > 0) {
      setCurrentConversation(loadedConversations[0])
    }
  }

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: selectedModel.id,
      systemPrompt: settings?.systemPrompt
    }
    setCurrentConversation(newConversation)
    setConversations(prev => [newConversation, ...prev])
    saveConversation(newConversation)
    playSound("click")
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return
    if (!selectedModel) {
      alert("Please select an AI model first")
      return
    }
    if (!currentConversation) {
      handleNewConversation()
    }

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
      tokens: estimateTokens(input)
    }

    const updatedConversation: Conversation = {
      ...currentConversation!,
      id: currentConversation?.id || generateId(),
      title: currentConversation?.messages.length === 0 ? generateTitle(input) : currentConversation?.title || "New Chat",
      messages: [...(currentConversation?.messages || []), userMessage],
      updatedAt: Date.now(),
      modelId: selectedModel.id,
      createdAt: currentConversation?.createdAt || Date.now()
    }

    setCurrentConversation(updatedConversation)
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== updatedConversation.id)
      return [updatedConversation, ...filtered]
    })
    setInput("")
    setIsLoading(true)
    playSound("click")

    try {
      abortControllerRef.current = new AbortController()
      
      // Get context messages based on settings
      const contextLength = settings?.contextLength || 10
      const contextMessages = updatedConversation.messages.slice(-contextLength)
      
      // Create placeholder for streaming response
      const assistantMessageId = generateId()
      const streamingMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: Date.now()
      }
      
      // Show streaming message
      const streamingConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, streamingMessage],
        updatedAt: Date.now()
      }
      setCurrentConversation(streamingConversation)
      setIsStreaming(true)
      
      // Stream the response if enabled, otherwise use regular
      if (settings?.streamingEnabled) {
        let fullContent = ""
        const stream = streamAIMessage(
          userMessage.content,
          selectedModel.id,
          contextMessages.map(m => ({ role: m.role, content: m.content, timestamp: new Date(m.timestamp) }))
        )
        
        for await (const chunk of stream) {
          fullContent = chunk
          // Update message content in real-time
          const updatedStreamingConv = {
            ...streamingConversation,
            messages: streamingConversation.messages.map(m => 
              m.id === assistantMessageId 
                ? { ...m, content: fullContent }
                : m
            )
          }
          setCurrentConversation(updatedStreamingConv)
        }
        
        // Finalize message
        const finalMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: fullContent,
          timestamp: Date.now(),
          tokens: estimateTokens(fullContent)
        }
        
        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, finalMessage],
          updatedAt: Date.now()
        }
        
        setCurrentConversation(finalConversation)
        setConversations(prev => {
          const filtered = prev.filter(c => c.id !== finalConversation.id)
          return [finalConversation, ...filtered]
        })
        saveConversation(finalConversation)
      } else {
        // Non-streaming mode
        const response = await sendAIMessage(
          userMessage.content,
          selectedModel.id,
          contextMessages.map(m => ({ role: m.role, content: m.content, timestamp: new Date(m.timestamp) })),
          settings?.systemPrompt
        )

        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: response,
          timestamp: Date.now(),
          tokens: estimateTokens(response)
        }

        const finalConversation: Conversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, assistantMessage],
          updatedAt: Date.now()
        }

        setCurrentConversation(finalConversation)
        setConversations(prev => {
          const filtered = prev.filter(c => c.id !== finalConversation.id)
          return [finalConversation, ...filtered]
        })
        saveConversation(finalConversation)
      }
      
      playSound("notification")
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        const errorMsg = error instanceof Error ? error.message : "Unknown error"
        
        // Check if it's a Deepseek authentication error
        if (errorMsg.includes("Authentication") || errorMsg.includes("invalid")) {
          setApiError("Deepseek API key is invalid. Please update it or use RapidAPI services.")
          setUseRapidAPI(true)
          setShowApiKeyDialog(true)
        }
        
        const errorMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: `⚠️ 错误: ${errorMsg || "无法获取AI响应。请检查API配置或重试。"}`,
          timestamp: Date.now()
        }
        const errorConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, errorMessage],
          updatedAt: Date.now()
        }
        setCurrentConversation(errorConversation)
        saveConversation(errorConversation)
        playSound("error")
        console.error("[v0] AI API error:", error)
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleStopGeneration = () => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
    setIsStreaming(false)
  }

  const handleRegenerateMessage = async (messageIndex: number) => {
    if (!currentConversation || isLoading) return
    
    // Find the last user message before this assistant message
    const messages = currentConversation.messages.slice(0, messageIndex)
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")
    if (!lastUserMessage) return

    // Remove messages from this point
    const updatedMessages = messages
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
      updatedAt: Date.now()
    }
    
    setCurrentConversation(updatedConversation)
    setInput(lastUserMessage.content)
    
    // Resend
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.id)
    setEditingContent(message.content)
  }

  const handleSaveEdit = async (messageIndex: number) => {
    if (!currentConversation || !editingContent.trim()) return

    const updatedMessages = [...currentConversation.messages]
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: editingContent,
      edited: true
    }

    // If editing a user message, remove subsequent messages and regenerate
    if (updatedMessages[messageIndex].role === "user") {
      const trimmedMessages = updatedMessages.slice(0, messageIndex + 1)
      const updatedConversation = {
        ...currentConversation,
        messages: trimmedMessages,
        updatedAt: Date.now()
      }
      setCurrentConversation(updatedConversation)
      setEditingMessageId(null)
      setEditingContent("")
      
      // Regenerate response
      setInput("")
      setIsLoading(true)
      
      try {
        const response = await sendAIMessage(
          editingContent,
          selectedModel.id,
          trimmedMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content, timestamp: new Date(m.timestamp) }))
        )

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: response,
          timestamp: Date.now()
        }

        const finalConversation = {
          ...updatedConversation,
          messages: [...trimmedMessages, assistantMessage],
          updatedAt: Date.now()
        }
        setCurrentConversation(finalConversation)
        saveConversation(finalConversation)
        playSound("notification")
      } catch {
        playSound("error")
      } finally {
        setIsLoading(false)
      }
    } else {
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        updatedAt: Date.now()
      }
      setCurrentConversation(updatedConversation)
      saveConversation(updatedConversation)
      setEditingMessageId(null)
      setEditingContent("")
    }
  }

  const handleCopyMessage = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
    playSound("click")
  }

  const handleFeedback = (messageId: string, feedback: "like" | "dislike") => {
    if (!currentConversation) return
    
    const updatedMessages = currentConversation.messages.map(m => 
      m.id === messageId ? { ...m, feedback } : m
    )
    const updatedConversation = { ...currentConversation, messages: updatedMessages }
    setCurrentConversation(updatedConversation)
    saveConversation(updatedConversation)
    playSound("click")
  }

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id)
    setConversations(prev => prev.filter(c => c.id !== id))
    if (currentConversation?.id === id) {
      const remaining = conversations.filter(c => c.id !== id)
      setCurrentConversation(remaining[0] || null)
    }
    playSound("click")
  }

  const handleClearConversation = () => {
    if (!currentConversation) return
    const cleared = { ...currentConversation, messages: [], updatedAt: Date.now() }
    setCurrentConversation(cleared)
    saveConversation(cleared)
    playSound("click")
  }

  const handlePinConversation = (id: string) => {
    const updated = conversations.map(c => 
      c.id === id ? { ...c, pinned: !c.pinned } : c
    )
    setConversations(updated)
    const conv = updated.find(c => c.id === id)
    if (conv) saveConversation(conv)
    playSound("click")
  }

  const handleExport = (format: "json" | "markdown" | "txt") => {
    if (!currentConversation) return
    const content = exportConversation(currentConversation, format)
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentConversation.title}.${format === "markdown" ? "md" : format}`
    a.click()
    URL.revokeObjectURL(url)
    playSound("click")
  }

  const handleExportAll = () => {
    const content = exportAllConversations(conversations)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orbit-ai-conversations.json"
    a.click()
    URL.revokeObjectURL(url)
    playSound("click")
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string
      const imported = importConversations(content)
      for (const conv of imported) {
        await saveConversation({ ...conv, id: generateId() })
      }
      await loadData()
      playSound("notification")
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    const fileList = Array.from(files)
    let fileContent = ""
    
    for (const file of fileList) {
      try {
        const content = await file.text()
        fileContent += `\n\n### File: ${file.name}\n\`\`\`\n${content}\n\`\`\``
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error)
      }
    }
    
    if (fileContent) {
      setInput(prev => prev + fileContent)
      playSound("notification")
    }
    
    e.target.value = ""
  }

  const handleDownloadResponse = (content: string, filename: string = "response") => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.txt`
    a.click()
    URL.revokeObjectURL(url)
    playSound("click")
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support voice input")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = settings?.language === "zh" ? "zh-CN" : "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + transcript)
    }
    recognition.onerror = () => setIsListening(false)

    recognition.start()
  }

  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = settings?.language === "zh" ? "zh-CN" : "en-US"
    speechSynthesis.speak(utterance)
  }

  const filteredConversations = searchQuery 
    ? conversations.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : conversations

  const models = getAvailableModels()

  if (!isOpen) return null

  const panelClass = isFullscreen 
    ? "fixed inset-0 z-50" 
    : "fixed inset-y-0 right-0 w-full md:w-[800px] lg:w-[1000px] z-50"

  return (
    <div className={`${panelClass} bg-background border-l border-border shadow-2xl flex animate-slide-in-right`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 border-r border-border flex flex-col bg-muted/30">
          {/* Sidebar Header */}
          <div className="p-3 border-b border-border">
            <Button 
              onClick={handleNewConversation} 
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="chat-search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setCurrentConversation(conv)
                    playSound("click")
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors group relative ${
                    currentConversation?.id === conv.id 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {conv.pinned && <Pin className="h-3 w-3 text-primary" />}
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm flex-1">{conv.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {conv.messages.length} messages
                  </p>
                  
                  {/* Actions */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePinConversation(conv.id)
                      }}
                      className="p-1 hover:bg-background rounded"
                    >
                      <Pin className={`h-3 w-3 ${conv.pinned ? "text-primary" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConversation(conv.id)
                      }}
                      className="p-1 hover:bg-background rounded text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </button>
              ))}
              
              {filteredConversations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No conversations
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-border space-y-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-3 w-3" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={handleExportAll}>
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full gap-2" 
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Orbit AI</h2>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (!selectedModel) {
                  alert("Please select a model first")
                  return
                }
                setIsLoading(true)
                try {
                  const response = await sendAIMessage("Hello, test connection", selectedModel.id)
                  alert(`API Connected!\n\nResponse: ${response.slice(0, 100)}...`)
                } catch (error) {
                  alert(`API Error: ${error instanceof Error ? error.message : "Unknown error"}`)
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading || !selectedModel}
              className="text-xs px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-foreground transition-colors disabled:opacity-50"
            >
              {isLoading ? "Testing..." : "Test"}
            </button>
            
            {/* Model Selector */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="gap-2"
              >
                {selectedModel.name}
                <ChevronDown className={`h-3 w-3 transition-transform ${showModelSelector ? "rotate-180" : ""}`} />
              </Button>
              
              {showModelSelector && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="sticky top-0 bg-card border-b border-border p-2 space-y-2">
                    <Input
                      placeholder="Search models..."
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="p-2 space-y-1">
                    {availableModels
                      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.provider.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(model => {
                        const provider = model.provider
                        return (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model)
                              setShowModelSelector(false)
                              setSearchQuery("")
                              playSound("click")
                            }}
                            className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-start gap-3 ${
                              selectedModel?.id === model.id ? "bg-primary/10 border border-primary/20" : ""
                            }`}
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center bg-muted">
                              {provider && (
                                <img 
                                  src={provider} 
                                  alt={model.provider} 
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none"
                              }}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{model.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{model.provider}</p>
                              <p className="text-xs text-muted-foreground mt-1">{model.category}</p>
                            </div>
                          </button>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {(!currentConversation || currentConversation.messages.length === 0) ? (
              <div className="text-center py-16">
                <Bot className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                <h3 className="text-xl font-semibold mb-2">Hello, I am Orbit AI</h3>
                <p className="text-muted-foreground mb-6">Your intelligent browser assistant</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {["Write an article", "Explain code", "Translate text", "Summarize content", "Help me learn"].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              currentConversation.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] group ${message.role === "user" ? "order-first" : ""}`}>
                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="min-h-[100px]"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit(index)}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditingMessageId(null)
                            setEditingContent("")
                          }}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-lg ${
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <MarkdownRenderer content={message.content} />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                        
                        {message.edited && (
                          <span className="text-xs opacity-50 mt-2 block">(edited)</span>
                        )}
                      </div>
                    )}
                    
                    {/* Message Actions */}
                    <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                      <button
                        onClick={() => handleCopyMessage(message.content, message.id)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        title="Copy"
                      >
                        {copiedId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </button>
                      
                      <button
                        onClick={() => handleEditMessage(message)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      
                      {message.role === "assistant" && (
                        <>
                          <button
                            onClick={() => handleRegenerateMessage(index)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                            title="Regenerate"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDownloadResponse(message.content, `ai-response-${index}`)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                            title="Download response"
                          >
                            <Download className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleSpeak(message.content)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                            title="Read aloud"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, "like")}
                            className={`p-1 hover:bg-muted rounded ${message.feedback === "like" ? "text-green-500" : "text-muted-foreground hover:text-foreground"}`}
                            title="Good response"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, "dislike")}
                            className={`p-1 hover:bg-muted rounded ${message.feedback === "dislike" ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                            title="Bad response"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </>
                      )}
                      
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  placeholder="Type a message... (Shift+Enter for new line)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isLoading}
                  className="min-h-[52px] max-h-[200px] resize-none pr-20"
                  rows={1}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                    title="Upload file"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening ? "bg-red-500 text-white" : "hover:bg-muted text-muted-foreground"
                    }`}
                    title="Voice input"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  
                  {input.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ~{estimateTokens(input)} tokens
                    </span>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.json,.py,.js,.ts,.jsx,.tsx,.html,.css,.md,.pdf,.csv,.xml"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload file"
                />
              </div>
              
              {isLoading ? (
                <Button onClick={handleStopGeneration} variant="destructive" size="icon" className="h-[52px] w-[52px]">
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!input.trim()}
                  size="icon"
                  className="h-[52px] w-[52px]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex gap-4">
                <span>Ctrl+K: New chat</span>
                <span>Ctrl+/: Search</span>
              </div>
              {currentConversation && (
                <div className="flex gap-2">
                  <button onClick={() => handleExport("json")} className="hover:text-foreground">Export JSON</button>
                  <button onClick={() => handleExport("markdown")} className="hover:text-foreground">Export MD</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* API Key Configuration Dialog */}
      {showApiKeyDialog && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {apiError ? "API Configuration Error" : "Deepseek API Configuration"}
              </h3>
            </div>
            
            {apiError && (
              <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-lg text-sm text-destructive">
                {apiError}
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              {useRapidAPI 
                ? "The Deepseek API key appears to be invalid. You can try a new key, or skip to use our RapidAPI services which don't require authentication."
                : "Enter your Deepseek API key to enable AI chat. Get one from "}
              {!useRapidAPI && (
                <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  platform.deepseek.com
                </a>
              )}
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveApiKey()
                  }
                }}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground">
              <p>Your API key is stored locally in your browser and never sent to any server.</p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowApiKeyDialog(false)
                  setApiKeyInput("")
                }}
              >
                Skip
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput}
              >
                Save API Key
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && settings && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Settings</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Context Length (messages)</label>
                <Input
                  type="number"
                  value={settings.contextLength}
                  onChange={(e) => {
                    const newSettings = { ...settings, contextLength: parseInt(e.target.value) || 10 }
                    setSettings(newSettings)
                    saveSettings(newSettings)
                  }}
                  min={1}
                  max={50}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">System Prompt</label>
                <Textarea
                  value={settings.systemPrompt}
                  onChange={(e) => {
                    const newSettings = { ...settings, systemPrompt: e.target.value }
                    setSettings(newSettings)
                    saveSettings(newSettings)
                  }}
                  rows={4}
                  placeholder="Enter system prompt..."
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sound Effects</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled }
                    setSettings(newSettings)
                    saveSettings(newSettings)
                  }}
                >
                  {settings.soundEnabled ? "On" : "Off"}
                </Button>
              </div>
              
              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete all conversations?")) {
                      await clearAllConversations()
                      setConversations([])
                      setCurrentConversation(null)
                      setShowSettings(false)
                      playSound("click")
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  )
}
