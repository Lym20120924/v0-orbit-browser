"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Search,
  Check,
  Brain,
  Code,
  Eye,
  ImageIcon,
  Music,
  Video,
  Database,
  Calculator,
  List,
  Key,
} from "lucide-react"
import { AI_PROVIDERS, MODEL_CATEGORIES, getAllModels, getModelsByCategory } from "@/lib/ai-models"
import { playSound } from "@/lib/sounds"

interface AIModelsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  onSelectModel: (modelId: string) => void
  apiKeys: Record<string, string>
  onUpdateApiKey: (keyName: string, value: string) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  chat: <Brain className="h-4 w-4" />,
  code: <Code className="h-4 w-4" />,
  vision: <Eye className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  audio: <Music className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  embedding: <Database className="h-4 w-4" />,
  reasoning: <Brain className="h-4 w-4" />,
  search: <Search className="h-4 w-4" />,
  math: <Calculator className="h-4 w-4" />,
  rerank: <List className="h-4 w-4" />,
}

export function AIModelsPanel({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  apiKeys,
  onUpdateApiKey,
}: AIModelsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showApiKeySettings, setShowApiKeySettings] = useState(false)
  const [editingApiKey, setEditingApiKey] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState("")

  const allModels = useMemo(() => getAllModels(), [])

  const filteredModels = useMemo(() => {
    let models = activeTab === "all" ? allModels : getModelsByCategory(activeTab)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      models = models.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query),
      )
    }

    return models
  }, [allModels, activeTab, searchQuery])

  const handleSelectModel = (modelId: string) => {
    onSelectModel(modelId)
    playSound("click")
  }

  const handleSaveApiKey = (keyName: string) => {
    if (apiKeyInput.trim()) {
      onUpdateApiKey(keyName, apiKeyInput.trim())
      playSound("success")
    }
    setEditingApiKey(null)
    setApiKeyInput("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-[900px] max-h-[80vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI 模型中心</h2>
              <p className="text-xs text-muted-foreground">{allModels.length} 个模型可用</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowApiKeySettings(!showApiKeySettings)}>
              <Key className="h-4 w-4 mr-2" />
              API 密钥
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showApiKeySettings ? (
          /* API Key Settings View */
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <h3 className="font-medium mb-4">配置 API 密钥</h3>
                {AI_PROVIDERS.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-2xl">{provider.logo}</span>
                    <div className="flex-1">
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.apiKeyName}</p>
                    </div>
                    {editingApiKey === provider.apiKeyName ? (
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          placeholder="输入 API 密钥..."
                          className="w-64"
                        />
                        <Button size="sm" onClick={() => handleSaveApiKey(provider.apiKeyName)}>
                          保存
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingApiKey(null)}>
                          取消
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {apiKeys[provider.apiKeyName] ? (
                          <span className="text-xs text-green-500 flex items-center gap-1">
                            <Check className="h-3 w-3" /> 已配置
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">未配置</span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingApiKey(provider.apiKeyName)
                            setApiKeyInput(apiKeys[provider.apiKeyName] || "")
                          }}
                        >
                          {apiKeys[provider.apiKeyName] ? "修改" : "添加"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          /* Model Selection View */
          <>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索模型..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 border-b border-border">
                <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-1">
                  <TabsTrigger value="all" className="text-xs">
                    全部 ({allModels.length})
                  </TabsTrigger>
                  {MODEL_CATEGORIES.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs flex items-center gap-1">
                      {category.icon} {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {filteredModels.map((model) => {
                      const provider = AI_PROVIDERS.find((p) => p.id === model.provider)
                      const isSelected = selectedModel === model.id
                      const hasApiKey = apiKeys[model.apiKeyName]

                      return (
                        <button
                          key={model.id}
                          onClick={() => handleSelectModel(model.id)}
                          className={`
                            p-3 rounded-lg border text-left transition-all
                            ${
                              isSelected
                                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{provider?.logo}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{model.name}</p>
                                {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{model.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted">
                                  {categoryIcons[model.category]}
                                </span>
                                {model.maxTokens > 0 && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {model.maxTokens >= 1000
                                      ? `${Math.floor(model.maxTokens / 1000)}K`
                                      : model.maxTokens}{" "}
                                    tokens
                                  </span>
                                )}
                                {!hasApiKey && <span className="text-[10px] text-amber-500">需要密钥</span>}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            当前选择: {getAllModels().find((m) => m.id === selectedModel)?.name || "未选择"}
          </p>
          <Button onClick={onClose}>完成</Button>
        </div>
      </div>
    </div>
  )
}
