"use client";

import { useState, useEffect } from "react";
import { X, Search, Play, Copy, ExternalLink, RefreshCw, ChevronDown, ChevronRight, Check, Loader2, Globe, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FREE_APIS, 
  FREE_API_CATEGORIES, 
  CATEGORY_NAMES, 
  getCategories, 
  getAPIsByCategory, 
  searchAPIs, 
  callFreeAPI,
  TOTAL_API_COUNT,
  type FreeAPI,
  type APICategory 
} from "@/lib/free-apis";
import { playSound } from "@/lib/sounds";

interface APIHubPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APIHubPanel({ isOpen, onClose }: APIHubPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<APICategory | "all">("all");
  const [selectedAPI, setSelectedAPI] = useState<FreeAPI | null>(null);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["fun_games", "weather"]));

  if (!isOpen) return null;

  const categories = getCategories();
  
  const filteredAPIs = searchQuery 
    ? searchAPIs(searchQuery)
    : selectedCategory === "all" 
      ? FREE_APIS 
      : getAPIsByCategory(selectedCategory);

  const handleTestAPI = async (api: FreeAPI) => {
    setIsLoading(true);
    setApiResponse("");
    playSound("click");
    
    try {
      const url = customUrl || api.sampleUrl;
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      
      let data;
      if (contentType?.includes("application/json")) {
        data = await response.json();
        setApiResponse(JSON.stringify(data, null, 2));
      } else {
        data = await response.text();
        setApiResponse(data);
      }
      playSound("success");
    } catch (error) {
      setApiResponse(`错误: ${error instanceof Error ? error.message : "请求失败"}`);
      playSound("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    playSound("click");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
    playSound("click");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[95vw] max-w-6xl h-[90vh] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">API 中心</h2>
              <p className="text-sm text-muted-foreground">{TOTAL_API_COUNT} 个免费公共 API，无需注册或信用卡</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索 API..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2">
                <button
                  onClick={() => { setSelectedCategory("all"); playSound("click"); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === "all" ? "bg-primary/20 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>全部 API</span>
                    <span className="text-xs text-muted-foreground">{TOTAL_API_COUNT}</span>
                  </div>
                </button>
                
                <div className="mt-2 space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          selectedCategory === cat.id ? "bg-primary/20 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {expandedCategories.has(cat.id) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{cat.count}</span>
                      </button>
                      
                      {expandedCategories.has(cat.id) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {getAPIsByCategory(cat.id).slice(0, 5).map((api) => (
                            <button
                              key={api.id}
                              onClick={() => { setSelectedAPI(api); setCustomUrl(api.sampleUrl); playSound("click"); }}
                              className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${
                                selectedAPI?.id === api.id ? "bg-accent/20 text-accent" : "hover:bg-muted text-muted-foreground"
                              }`}
                            >
                              <span>{api.icon}</span>
                              <span className="truncate">{api.name}</span>
                            </button>
                          ))}
                          {getAPIsByCategory(cat.id).length > 5 && (
                            <button
                              onClick={() => { setSelectedCategory(cat.id); playSound("click"); }}
                              className="w-full text-left px-3 py-1.5 text-xs text-primary hover:underline"
                            >
                              查看全部 {cat.count} 个...
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedAPI ? (
              <>
                {/* API Detail Header */}
                <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{selectedAPI.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedAPI.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedAPI.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded">
                            {CATEGORY_NAMES[selectedAPI.category as APICategory]}
                          </span>
                          <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-500 rounded flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            免费无需认证
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedAPI.baseUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      文档
                    </Button>
                  </div>
                </div>

                {/* API Test Section */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">测试 API</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="输入 API URL..."
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyUrl(customUrl || selectedAPI.sampleUrl)}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => handleTestAPI(selectedAPI)}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      发送请求
                    </Button>
                  </div>
                </div>

                {/* Response Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm min-h-[200px]">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : apiResponse ? (
                      <pre className="whitespace-pre-wrap break-words text-foreground">{apiResponse}</pre>
                    ) : (
                      <div className="text-muted-foreground text-center py-8">
                        点击"发送请求"测试此 API
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              /* API List */
              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredAPIs.map((api) => (
                    <button
                      key={api.id}
                      onClick={() => { setSelectedAPI(api); setCustomUrl(api.sampleUrl); playSound("click"); }}
                      className="p-4 bg-muted/30 hover:bg-muted/50 rounded-lg text-left transition-all hover:scale-[1.02] border border-transparent hover:border-primary/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{api.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{api.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{api.description}</p>
                          <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                            {CATEGORY_NAMES[api.category as APICategory]}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {filteredAPIs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    没有找到匹配的 API
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
