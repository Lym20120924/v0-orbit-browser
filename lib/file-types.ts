export interface FileType {
  type:
    | "pdf"
    | "image"
    | "video"
    | "audio"
    | "code"
    | "markdown"
    | "text"
    | "spreadsheet"
    | "document"
    | "presentation"
    | "archive"
    | "font"
    | "vector"
    | "ebook"
    | "model3d"
    | "unknown"
  extensions: string[]
  mimeTypes: string[]
  icon: string
  color: string
  category: string
}

export const fileTypes: FileType[] = [
  {
    type: "pdf",
    extensions: [".pdf"],
    mimeTypes: ["application/pdf"],
    icon: "FileText",
    color: "from-red-500 to-red-600",
    category: "document",
  },
  {
    type: "image",
    extensions: [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
      ".ico",
      ".tiff",
      ".tif",
      ".heic",
      ".heif",
      ".raw",
      ".cr2",
      ".nef",
      ".arw",
    ],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/x-icon",
      "image/tiff",
      "image/heic",
      "image/heif",
    ],
    icon: "Image",
    color: "from-green-500 to-green-600",
    category: "media",
  },
  {
    type: "video",
    extensions: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv", ".flv", ".wmv", ".m4v", ".3gp", ".mpeg", ".mpg"],
    mimeTypes: [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/x-flv",
      "video/x-ms-wmv",
    ],
    icon: "Film",
    color: "from-purple-500 to-purple-600",
    category: "media",
  },
  {
    type: "audio",
    extensions: [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac", ".wma", ".aiff", ".opus", ".mid", ".midi"],
    mimeTypes: [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",
      "audio/flac",
      "audio/aac",
      "audio/x-ms-wma",
      "audio/aiff",
      "audio/opus",
      "audio/midi",
    ],
    icon: "Music",
    color: "from-pink-500 to-pink-600",
    category: "media",
  },
  {
    type: "code",
    extensions: [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".html",
      ".css",
      ".scss",
      ".sass",
      ".less",
      ".json",
      ".xml",
      ".yaml",
      ".yml",
      ".py",
      ".java",
      ".c",
      ".cpp",
      ".h",
      ".hpp",
      ".go",
      ".rs",
      ".php",
      ".rb",
      ".swift",
      ".kt",
      ".scala",
      ".r",
      ".sql",
      ".sh",
      ".bash",
      ".zsh",
      ".ps1",
      ".bat",
      ".cmd",
      ".vue",
      ".svelte",
      ".astro",
    ],
    mimeTypes: [
      "text/javascript",
      "application/javascript",
      "text/typescript",
      "text/html",
      "text/css",
      "application/json",
      "text/x-python",
      "text/xml",
      "application/xml",
      "text/yaml",
    ],
    icon: "Code",
    color: "from-blue-500 to-blue-600",
    category: "code",
  },
  {
    type: "markdown",
    extensions: [".md", ".mdx", ".markdown", ".rst", ".adoc"],
    mimeTypes: ["text/markdown", "text/x-rst"],
    icon: "FileText",
    color: "from-gray-500 to-gray-600",
    category: "document",
  },
  {
    type: "text",
    extensions: [".txt", ".log", ".csv", ".tsv", ".ini", ".cfg", ".conf", ".env", ".gitignore", ".dockerignore"],
    mimeTypes: ["text/plain", "text/csv", "text/tab-separated-values"],
    icon: "FileText",
    color: "from-gray-400 to-gray-500",
    category: "document",
  },
  {
    type: "spreadsheet",
    extensions: [".xlsx", ".xls", ".csv", ".ods", ".numbers"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/vnd.oasis.opendocument.spreadsheet",
    ],
    icon: "Table",
    color: "from-emerald-500 to-emerald-600",
    category: "document",
  },
  {
    type: "document",
    extensions: [".doc", ".docx", ".odt", ".rtf", ".pages", ".tex", ".latex"],
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text",
      "application/rtf",
      "application/x-tex",
    ],
    icon: "FileText",
    color: "from-blue-400 to-blue-500",
    category: "document",
  },
  {
    type: "presentation",
    extensions: [".ppt", ".pptx", ".odp", ".key"],
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.oasis.opendocument.presentation",
    ],
    icon: "Presentation",
    color: "from-orange-500 to-orange-600",
    category: "document",
  },
  {
    type: "archive",
    extensions: [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".tar.gz", ".tar.bz2", ".tar.xz", ".tgz"],
    mimeTypes: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
      "application/gzip",
      "application/x-bzip2",
    ],
    icon: "Archive",
    color: "from-amber-500 to-amber-600",
    category: "archive",
  },
  {
    type: "font",
    extensions: [".ttf", ".otf", ".woff", ".woff2", ".eot", ".fon"],
    mimeTypes: ["font/ttf", "font/otf", "font/woff", "font/woff2", "application/vnd.ms-fontobject"],
    icon: "Type",
    color: "from-indigo-500 to-indigo-600",
    category: "font",
  },
  {
    type: "vector",
    extensions: [".ai", ".eps", ".ps", ".sketch", ".fig", ".xd"],
    mimeTypes: ["application/illustrator", "application/postscript"],
    icon: "PenTool",
    color: "from-yellow-500 to-yellow-600",
    category: "design",
  },
  {
    type: "ebook",
    extensions: [".epub", ".mobi", ".azw", ".azw3", ".fb2", ".djvu"],
    mimeTypes: ["application/epub+zip", "application/x-mobipocket-ebook"],
    icon: "BookOpen",
    color: "from-teal-500 to-teal-600",
    category: "document",
  },
  {
    type: "model3d",
    extensions: [".obj", ".fbx", ".gltf", ".glb", ".stl", ".dae", ".3ds", ".blend"],
    mimeTypes: ["model/gltf-binary", "model/gltf+json", "model/stl"],
    icon: "Box",
    color: "from-cyan-500 to-cyan-600",
    category: "3d",
  },
]

export function getFileType(filename: string, mimeType?: string): FileType {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."))

  for (const ft of fileTypes) {
    if (ft.extensions.includes(ext)) return ft
    if (mimeType && ft.mimeTypes.includes(mimeType)) return ft
  }

  return {
    type: "unknown",
    extensions: [],
    mimeTypes: [],
    icon: "File",
    color: "from-gray-400 to-gray-500",
    category: "other",
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileCategory(type: FileType["type"]): string {
  const ft = fileTypes.find((f) => f.type === type)
  return ft?.category || "other"
}

export function getAllExtensions(): string[] {
  return fileTypes.flatMap((ft) => ft.extensions)
}
