export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  model?: string
}

interface SendMessageOptions {
  model?: string
  apiKey?: string
}

export class AIAssistant {
  private messages: ChatMessage[] = []

  async sendMessage(userMessage: string, options?: SendMessageOptions): Promise<string> {
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
      model: options?.model,
    }
    this.messages.push(message)

    // Generate response based on user message
    const response = await this.generateResponse(userMessage, options)

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: response,
      timestamp: Date.now(),
      model: options?.model,
    }
    this.messages.push(assistantMessage)

    return response
  }

  private async generateResponse(userMessage: string, options?: SendMessageOptions): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

    const lowerMessage = userMessage.toLowerCase()
    const modelName = options?.model || "默认模型"

    // Intelligent response based on keywords
    if (lowerMessage.includes("你好") || lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return `你好！我是 Orbit AI 助手，目前使用 ${modelName} 模型为你服务。我可以帮助你：\n\n• 搜索网页内容\n• 翻译多种语言\n• 总结网页文章\n• 回答各种问题\n• 协助编程任务\n\n有什么我可以帮助你的吗？`
    }

    if (lowerMessage.includes("搜索") || lowerMessage.includes("search") || lowerMessage.includes("查找")) {
      const query = userMessage.replace(/搜索|search|查找|帮我|请|找/gi, "").trim()
      return `我可以帮你搜索 "${query || "相关内容"}"。\n\n建议你可以：\n1. 直接在地址栏输入关键词进行搜索\n2. 使用快捷键 Ctrl+L 快速定位到地址栏\n3. 点击侧边栏的历史记录查看之前访问过的相关页面\n\n需要我帮你做什么具体操作吗？`
    }

    if (lowerMessage.includes("翻译") || lowerMessage.includes("translate")) {
      return `我可以帮助你翻译文本！Orbit Browser 内置了强大的翻译功能：\n\n1. 点击工具栏的翻译按钮 🌐\n2. 选择源语言和目标语言\n3. 输入或粘贴要翻译的文本\n\n支持的语言包括：中文、英语、日语、韩语、法语、德语、西班牙语、俄语、阿拉伯语等 9 种语言。\n\n你想翻译什么内容？`
    }

    if (lowerMessage.includes("书签") || lowerMessage.includes("bookmark")) {
      return `管理书签很简单！\n\n• 添加书签：点击地址栏右侧的星标 ⭐\n• 查看书签：点击侧边栏的书签选项\n• 整理书签：使用智能书签面板进行分类管理\n\n你还可以为书签添加标签和笔记，方便日后查找。需要我帮你添加当前页面到书签吗？`
    }

    if (lowerMessage.includes("历史") || lowerMessage.includes("history")) {
      return `你的浏览历史保存在侧边栏中。\n\n• 点击侧边栏的历史记录图标查看\n• 历史记录按日期分组显示\n• 可以搜索特定的历史网页\n• 支持一键清除所有历史\n\n如果开启了无痕模式，浏览记录不会被保存。`
    }

    if (lowerMessage.includes("代码") || lowerMessage.includes("code") || lowerMessage.includes("编程")) {
      return `作为编程助手，我可以帮助你：\n\n1. **代码解释** - 解释代码的功能和逻辑\n2. **代码生成** - 根据描述生成代码\n3. **Bug 修复** - 帮助找出代码中的问题\n4. **最佳实践** - 提供代码优化建议\n\n支持多种编程语言：JavaScript、TypeScript、Python、Java、C++ 等。\n\n请告诉我你需要什么帮助？`
    }

    if (lowerMessage.includes("总结") || lowerMessage.includes("summarize") || lowerMessage.includes("摘要")) {
      return `我可以帮助你总结网页内容！\n\n使用方法：\n1. 打开你想要总结的网页\n2. 复制网页的主要内容\n3. 粘贴到这里让我帮你总结\n\n或者你可以直接告诉我网页的主题，我会生成一个概要。你想总结什么内容？`
    }

    if (lowerMessage.includes("模型") || lowerMessage.includes("model")) {
      return `Orbit Browser 支持 180+ 种 AI 模型！\n\n**主流提供商：**\n• OpenAI (GPT-4o, GPT-4, o1)\n• Anthropic (Claude 3.5, Claude 3)\n• Google (Gemini 2.5, Gemini 1.5)\n• DeepSeek (R1, V3)\n• Meta (Llama 3.2)\n• 阿里云 (通义千问)\n• 腾讯 (混元大模型)\n• 百度 (文心一言)\n\n点击上方的模型选择器可以切换不同的 AI 模型。每个模型都有其特长，可以根据需求选择最适合的模型。`
    }

    if (lowerMessage.includes("设置") || lowerMessage.includes("settings")) {
      return `Orbit Browser 的设置选项丰富：\n\n⚙️ **常规设置**\n• 语言选择（9种语言）\n• 主题切换（深色/浅色）\n• 默认搜索引擎\n• 主页设置\n\n🔒 **隐私设置**\n• 无痕浏览模式\n• 广告拦截器\n• Cookie 管理\n\n🎨 **外观设置**\n• 界面动画\n• 音效开关\n• 字体大小\n\n点击工具栏的设置图标即可访问完整设置。`
    }

    // Default intelligent response
    return `感谢你的问题！作为 Orbit AI 助手（当前使用 ${modelName}），我会尽力帮助你。\n\n关于 "${userMessage.slice(0, 50)}${userMessage.length > 50 ? "..." : ""}"，我可以提供以下帮助：\n\n1. 如果你想搜索相关信息，可以使用浏览器的搜索功能\n2. 如果需要翻译，可以使用内置的翻译工具\n3. 如果有其他问题，请详细描述你的需求\n\n我还可以帮助你使用浏览器的各种功能，如书签管理、历史记录、下载管理等。请告诉我你具体需要什么帮助？`
  }

  getMessages(): ChatMessage[] {
    return [...this.messages]
  }

  clearHistory() {
    this.messages = []
  }
}
