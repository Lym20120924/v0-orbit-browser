// Common word/phrase dictionary for translations
const translationDictionary: Record<string, Record<string, string>> = {
  en: {
    hello: "hello",
    world: "world",
    "thank you": "thank you",
    "good morning": "good morning",
    "good night": "good night",
    "how are you": "how are you",
    welcome: "welcome",
    goodbye: "goodbye",
    yes: "yes",
    no: "no",
    please: "please",
    sorry: "sorry",
    help: "help",
    search: "search",
    home: "home",
    settings: "settings",
    translate: "translate",
    language: "language",
    browser: "browser",
  },
  zh: {
    hello: "你好",
    world: "世界",
    "thank you": "谢谢",
    "good morning": "早上好",
    "good night": "晚安",
    "how are you": "你好吗",
    welcome: "欢迎",
    goodbye: "再见",
    yes: "是",
    no: "否",
    please: "请",
    sorry: "对不起",
    help: "帮助",
    search: "搜索",
    home: "首页",
    settings: "设置",
    translate: "翻译",
    language: "语言",
    browser: "浏览器",
  },
  ja: {
    hello: "こんにちは",
    world: "世界",
    "thank you": "ありがとう",
    "good morning": "おはよう",
    "good night": "おやすみ",
    "how are you": "お元気ですか",
    welcome: "ようこそ",
    goodbye: "さようなら",
    yes: "はい",
    no: "いいえ",
    please: "お願いします",
    sorry: "すみません",
    help: "ヘルプ",
    search: "検索",
    home: "ホーム",
    settings: "設定",
    translate: "翻訳",
    language: "言語",
    browser: "ブラウザ",
  },
  ko: {
    hello: "안녕하세요",
    world: "세계",
    "thank you": "감사합니다",
    "good morning": "좋은 아침",
    "good night": "안녕히 주무세요",
    "how are you": "어떻게 지내세요",
    welcome: "환영합니다",
    goodbye: "안녕히 가세요",
    yes: "네",
    no: "아니요",
    please: "부탁합니다",
    sorry: "죄송합니다",
    help: "도움",
    search: "검색",
    home: "홈",
    settings: "설정",
    translate: "번역",
    language: "언어",
    browser: "브라우저",
  },
  fr: {
    hello: "bonjour",
    world: "monde",
    "thank you": "merci",
    "good morning": "bonjour",
    "good night": "bonne nuit",
    "how are you": "comment allez-vous",
    welcome: "bienvenue",
    goodbye: "au revoir",
    yes: "oui",
    no: "non",
    please: "s'il vous plaît",
    sorry: "pardon",
    help: "aide",
    search: "rechercher",
    home: "accueil",
    settings: "paramètres",
    translate: "traduire",
    language: "langue",
    browser: "navigateur",
  },
  de: {
    hello: "hallo",
    world: "welt",
    "thank you": "danke",
    "good morning": "guten morgen",
    "good night": "gute nacht",
    "how are you": "wie geht es dir",
    welcome: "willkommen",
    goodbye: "auf wiedersehen",
    yes: "ja",
    no: "nein",
    please: "bitte",
    sorry: "entschuldigung",
    help: "hilfe",
    search: "suchen",
    home: "startseite",
    settings: "einstellungen",
    translate: "übersetzen",
    language: "sprache",
    browser: "browser",
  },
  es: {
    hello: "hola",
    world: "mundo",
    "thank you": "gracias",
    "good morning": "buenos días",
    "good night": "buenas noches",
    "how are you": "cómo estás",
    welcome: "bienvenido",
    goodbye: "adiós",
    yes: "sí",
    no: "no",
    please: "por favor",
    sorry: "lo siento",
    help: "ayuda",
    search: "buscar",
    home: "inicio",
    settings: "configuración",
    translate: "traducir",
    language: "idioma",
    browser: "navegador",
  },
  ru: {
    hello: "привет",
    world: "мир",
    "thank you": "спасибо",
    "good morning": "доброе утро",
    "good night": "спокойной ночи",
    "how are you": "как дела",
    welcome: "добро пожаловать",
    goodbye: "до свидания",
    yes: "да",
    no: "нет",
    please: "пожалуйста",
    sorry: "извините",
    help: "помощь",
    search: "поиск",
    home: "главная",
    settings: "настройки",
    translate: "перевод",
    language: "язык",
    browser: "браузер",
  },
  ar: {
    hello: "مرحبا",
    world: "عالم",
    "thank you": "شكرا",
    "good morning": "صباح الخير",
    "good night": "تصبح على خير",
    "how are you": "كيف حالك",
    welcome: "أهلا وسهلا",
    goodbye: "مع السلامة",
    yes: "نعم",
    no: "لا",
    please: "من فضلك",
    sorry: "آسف",
    help: "مساعدة",
    search: "بحث",
    home: "الرئيسية",
    settings: "إعدادات",
    translate: "ترجمة",
    language: "لغة",
    browser: "متصفح",
  },
}

// Extended sentence patterns for smarter translation
const sentencePatterns: Record<string, Record<string, string>> = {
  en: {
    "i love you": "i love you",
    "what is your name": "what is your name",
    "nice to meet you": "nice to meet you",
    "see you later": "see you later",
    "have a nice day": "have a nice day",
    "i don't understand": "i don't understand",
    "can you help me": "can you help me",
    "where is": "where is",
    "how much": "how much",
    "what time": "what time",
  },
  zh: {
    "i love you": "我爱你",
    "what is your name": "你叫什么名字",
    "nice to meet you": "很高兴认识你",
    "see you later": "回头见",
    "have a nice day": "祝你今天愉快",
    "i don't understand": "我不明白",
    "can you help me": "你能帮我吗",
    "where is": "在哪里",
    "how much": "多少钱",
    "what time": "几点",
  },
  ja: {
    "i love you": "愛してる",
    "what is your name": "お名前は何ですか",
    "nice to meet you": "はじめまして",
    "see you later": "また後で",
    "have a nice day": "良い一日を",
    "i don't understand": "わかりません",
    "can you help me": "手伝ってくれますか",
    "where is": "どこですか",
    "how much": "いくらですか",
    "what time": "何時",
  },
  ko: {
    "i love you": "사랑해요",
    "what is your name": "이름이 뭐예요",
    "nice to meet you": "만나서 반갑습니다",
    "see you later": "나중에 봐요",
    "have a nice day": "좋은 하루 되세요",
    "i don't understand": "이해 못해요",
    "can you help me": "도와주실 수 있나요",
    "where is": "어디예요",
    "how much": "얼마예요",
    "what time": "몇 시",
  },
  fr: {
    "i love you": "je t'aime",
    "what is your name": "comment vous appelez-vous",
    "nice to meet you": "enchanté",
    "see you later": "à plus tard",
    "have a nice day": "bonne journée",
    "i don't understand": "je ne comprends pas",
    "can you help me": "pouvez-vous m'aider",
    "where is": "où est",
    "how much": "combien",
    "what time": "quelle heure",
  },
  de: {
    "i love you": "ich liebe dich",
    "what is your name": "wie heißen sie",
    "nice to meet you": "freut mich",
    "see you later": "bis später",
    "have a nice day": "schönen tag noch",
    "i don't understand": "ich verstehe nicht",
    "can you help me": "können sie mir helfen",
    "where is": "wo ist",
    "how much": "wie viel",
    "what time": "wie spät",
  },
  es: {
    "i love you": "te quiero",
    "what is your name": "cómo te llamas",
    "nice to meet you": "mucho gusto",
    "see you later": "hasta luego",
    "have a nice day": "que tengas un buen día",
    "i don't understand": "no entiendo",
    "can you help me": "puedes ayudarme",
    "where is": "dónde está",
    "how much": "cuánto cuesta",
    "what time": "qué hora",
  },
  ru: {
    "i love you": "я тебя люблю",
    "what is your name": "как вас зовут",
    "nice to meet you": "приятно познакомиться",
    "see you later": "увидимся позже",
    "have a nice day": "хорошего дня",
    "i don't understand": "я не понимаю",
    "can you help me": "вы можете мне помочь",
    "where is": "где",
    "how much": "сколько стоит",
    "what time": "который час",
  },
  ar: {
    "i love you": "أحبك",
    "what is your name": "ما اسمك",
    "nice to meet you": "سعدت بلقائك",
    "see you later": "أراك لاحقا",
    "have a nice day": "أتمنى لك يوما سعيدا",
    "i don't understand": "لا أفهم",
    "can you help me": "هل يمكنك مساعدتي",
    "where is": "أين",
    "how much": "كم الثمن",
    "what time": "كم الساعة",
  },
}

// Detect language from text
function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase()

  // Check for Chinese characters
  if (/[\u4e00-\u9fff]/.test(text)) return "zh"
  // Check for Japanese characters
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return "ja"
  // Check for Korean characters
  if (/[\uac00-\ud7af]/.test(text)) return "ko"
  // Check for Arabic characters
  if (/[\u0600-\u06ff]/.test(text)) return "ar"
  // Check for Cyrillic (Russian)
  if (/[\u0400-\u04ff]/.test(text)) return "ru"

  // Check dictionary matches for European languages
  for (const lang of ["fr", "de", "es"]) {
    const dict = translationDictionary[lang]
    for (const [key, value] of Object.entries(dict)) {
      if (lowerText.includes(value.toLowerCase())) {
        return lang
      }
    }
  }

  return "en" // Default to English
}

// Find reverse translation (from target language to source)
function findSourceWord(word: string, sourceLang: string): string | null {
  const sourceDict = translationDictionary[sourceLang]
  if (!sourceDict) return null

  for (const [engKey, translation] of Object.entries(sourceDict)) {
    if (translation.toLowerCase() === word.toLowerCase()) {
      return engKey
    }
  }
  return null
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<{ translatedText: string; detectedLanguage?: string }> {
  // Simulate network delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

  const detectedLang = sourceLang === "auto" ? detectLanguage(text) : sourceLang
  const lowerText = text.toLowerCase().trim()

  // If source and target are the same, return original
  if (detectedLang === targetLang) {
    return { translatedText: text, detectedLanguage: detectedLang }
  }

  // Get target dictionary
  const targetDict = translationDictionary[targetLang] || translationDictionary.en
  const targetPatterns = sentencePatterns[targetLang] || sentencePatterns.en

  // Try to match sentence patterns first
  for (const [pattern, translation] of Object.entries(sentencePatterns.en)) {
    if (lowerText.includes(pattern)) {
      const targetTranslation = targetPatterns[pattern] || translation
      return { translatedText: targetTranslation, detectedLanguage: detectedLang }
    }
  }

  // If source is not English, first find the English equivalent
  let englishText = lowerText
  if (detectedLang !== "en") {
    const sourceDict = translationDictionary[detectedLang]
    if (sourceDict) {
      for (const [engKey, sourceWord] of Object.entries(sourceDict)) {
        if (lowerText.includes(sourceWord.toLowerCase())) {
          englishText = englishText.replace(sourceWord.toLowerCase(), engKey)
        }
      }
    }
  }

  // Translate word by word
  let translatedText = englishText
  const words = englishText.split(/\s+/)

  for (const word of words) {
    const cleanWord = word.replace(/[.,!?;:'"()]/g, "").toLowerCase()
    if (targetDict[cleanWord]) {
      translatedText = translatedText.replace(new RegExp(`\\b${cleanWord}\\b`, "gi"), targetDict[cleanWord])
    }
  }

  // If no translation found, return a helpful message with the original
  if (translatedText === englishText && detectedLang !== targetLang) {
    const langNames: Record<string, string> = {
      zh: "中文",
      en: "English",
      ja: "日本語",
      ko: "한국어",
      fr: "Français",
      de: "Deutsch",
      es: "Español",
      ru: "Русский",
      ar: "العربية",
    }

    // Provide a basic phonetic/formatted response
    const responses: Record<string, string> = {
      zh: `[翻译] ${text}`,
      ja: `[翻訳] ${text}`,
      ko: `[번역] ${text}`,
      fr: `[Traduction] ${text}`,
      de: `[Übersetzung] ${text}`,
      es: `[Traducción] ${text}`,
      ru: `[Перевод] ${text}`,
      ar: `[ترجمة] ${text}`,
      en: `[Translation] ${text}`,
    }

    translatedText = responses[targetLang] || `[${langNames[targetLang] || targetLang}] ${text}`
  }

  return {
    translatedText: translatedText.charAt(0).toUpperCase() + translatedText.slice(1),
    detectedLanguage: detectedLang,
  }
}

export async function translateDocument(
  content: string,
  format: "text" | "markdown" | "html",
  sourceLang: string,
  targetLang: string,
): Promise<string> {
  // Split content into paragraphs for better translation
  const paragraphs = content.split(/\n\n+/)
  const translatedParagraphs: string[] = []

  for (const paragraph of paragraphs) {
    if (paragraph.trim()) {
      const result = await translateText(paragraph, sourceLang, targetLang)
      translatedParagraphs.push(result.translatedText)
    } else {
      translatedParagraphs.push("")
    }
  }

  return translatedParagraphs.join("\n\n")
}
