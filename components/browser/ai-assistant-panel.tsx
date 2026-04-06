"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User, Sparkles, ChevronDown } from "lucide-react"
import { AIAssistant, type ChatMessage } from "@/lib/ai-assistant"
import { playSound } from "@/lib/sounds"
import { getModelById, AI_PROVIDERS } from "@/lib/ai-models"
import { AIModelsPanel } from "./ai-models-panel"

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  currentUrl: string
  onNavigate: (url: string) => void
}

export function AIAssistantPanel({ isOpen, onClose, currentUrl, onNavigate }: AIAssistantPanelProps) {
  const [aiAssistant] = useState(() => new AIAssistant())
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load API keys from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKeys = localStorage.getItem("orbit-ai-api-keys")
      if (savedKeys) {
        try {
          setApiKeys(JSON.parse(savedKeys))
        } catch (e) {
          console.error("Failed to parse API keys")
        }
      }
    }
  }, [])

  const handleUpdateApiKey = (keyName: string, value: string) => {
    const newKeys = { ...apiKeys, [keyName]: value }
    setApiKeys(newKeys)
    if (typeof window !== "undefined") {
      localStorage.setItem("orbit-ai-api-keys", JSON.stringify(newKeys))
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput("")
    setIsLoading(true)
    playSound("click")

    try {
      const model = getModelById(selectedModel)
      const response = await aiAssistant.sendMessage(userMessage, {
        model: selectedModel,
        apiKey: model ? apiKeys[model.apiKeyName] : undefined,
      })
      setMessages(aiAssistant.getMessages())
      playSound("notification")
    } catch (error) {
      console.error("[v0] AI error:", error)
      playSound("error")
    } finally {
      setIsLoading(false)
    }
  }

  const currentModel = getModelById(selectedModel)
  const currentProvider = currentModel ? AI_PROVIDERS.find((p) => p.id === currentModel.provider) : null

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Orbit AI</h2>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Model Selector */}
        <div className="px-4 py-2 border-b border-border">
          <button
            onClick={() => setShowModelSelector(true)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentProvider?.logo || "🤖"}</span>
              <div className="text-left">
                <p className="text-sm font-medium">{currentModel?.name || "选择模型"}</p>
                <p className="text-xs text-muted-foreground">{currentProvider?.name}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium mb-2">你好！我是 Orbit AI</p>
                <p className="text-sm">你的智能浏览器助手，支持 180+ 个 AI 模型</p>
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
              messages.map((message) => (
                <div
                  key={message.id}
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

      <AIModelsPanel
        isOpen={showModelSelector}
        onClose={() => setShowModelSelector(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        apiKeys={apiKeys}
        onUpdateApiKey={handleUpdateApiKey}
      />
    </>
  )
}
