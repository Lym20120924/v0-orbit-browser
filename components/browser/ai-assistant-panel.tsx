"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User, Sparkles, Trash2, ChevronDown, Loader2 } from "lucide-react"
import { playSound } from "@/lib/sounds"
import { sendAIMessage, getAvailableModels, type ChatMessage, type AIModel } from "@/lib/ai-api"

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  currentUrl?: string
  onNavigate?: (url: string) => void
}

export function AIAssistantPanel({ isOpen, onClose, currentUrl, onNavigate }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>(getAvailableModels()[0])
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    
    // Add user message
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)
    playSound("click")

    try {
      // Call real API
      const response = await sendAIMessage(userMessage, selectedModel.id, messages)
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      playSound("notification")
    } catch (error) {
      console.error("[v0] AI error:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "抱歉，发生了错误。请稍后重试。",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      playSound("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = () => {
    setMessages([])
    playSound("click")
  }

  const getProviderEmoji = (provider: string) => {
    const emojis: Record<string, string> = {
      "OpenAI": "🤖",
      "Google": "🌟",
      "Anthropic": "🎭",
      "DeepSeek": "🔍",
      "Microsoft": "💼",
      "Meta": "🦙",
      "Tencent": "🐧",
      "Alibaba": "☁️",
      "Mistral AI": "🌊"
    }
    return emojis[provider] || "🤖"
  }

  if (!isOpen) return null

  const models = getAvailableModels()

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Orbit AI</h2>
          <Sparkles className="h-4 w-4 text-accent animate-pulse" />
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={handleClearHistory} title="清除历史">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Model Selector */}
      <div className="px-4 py-2 border-b border-border relative">
        <button
          onClick={() => setShowModelSelector(!showModelSelector)}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{getProviderEmoji(selectedModel.provider)}</span>
            <div className="text-left">
              <p className="text-sm font-medium">{selectedModel.name}</p>
              <p className="text-xs text-muted-foreground">{selectedModel.provider} - API模式</p>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showModelSelector ? "rotate-180" : ""}`} />
        </button>

        {/* Model Dropdown */}
        {showModelSelector && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model)
                  setShowModelSelector(false)
                  playSound("click")
                }}
                className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted transition-colors ${
                  selectedModel.id === model.id ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-lg">{getProviderEmoji(model.provider)}</span>
                <div>
                  <p className="text-sm font-medium">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">你好！我是 Orbit AI</p>
              <p className="text-sm">你的智能浏览器助手</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {["搜索网页", "翻译文本", "总结内容", "写代码"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1 text-xs rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p className="text-xs opacity-50 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-2 justify-start animate-fade-in-up">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
