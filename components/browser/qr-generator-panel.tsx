"use client"

import { useState } from "react"
import { QrCode, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QRGenerator } from "@/lib/qr-generator"
import { playSound } from "@/lib/sounds"
import { useLanguage } from "@/lib/i18n"

interface QRGeneratorPanelProps {
  isOpen: boolean
  url: string
  onClose: () => void
}

export function QRGeneratorPanel({ isOpen, url: currentUrl, onClose }: QRGeneratorPanelProps) {
  const { t } = useLanguage()
  const [url, setUrl] = useState(currentUrl)
  const [qrCode, setQrCode] = useState<string>("")
  const [size, setSize] = useState(256)

  const generateQR = () => {
    const qr = QRGenerator.generateQR(url, size)
    setQrCode(qr)
    playSound("success")
  }

  const downloadQR = () => {
    if (qrCode) {
      QRGenerator.downloadQR(qrCode, "orbit-qrcode.png")
      playSound("download")
    }
  }

  const copyToClipboard = async () => {
    if (qrCode) {
      try {
        const response = await fetch(qrCode)
        const blob = await response.blob()
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        playSound("success")
      } catch (error) {
        console.error("Failed to copy QR code:", error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-4 top-16 w-96 bg-background border border-border rounded-lg shadow-2xl z-50 animate-slide-in-right">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          <h3 className="font-semibold">{t("qrGenerator")}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">{t("url")}</label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="animate-fade-in"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">{t("size")}</label>
          <Input
            type="number"
            value={size}
            onChange={(e) => setSize(Number.parseInt(e.target.value) || 256)}
            min={128}
            max={512}
            className="animate-fade-in"
          />
        </div>

        <Button onClick={generateQR} className="w-full animate-scale-in">
          <QrCode className="w-4 h-4 mr-2" />
          {t("generate")}
        </Button>

        {qrCode && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadQR} variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                {t("download")}
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                {t("copy")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
