export interface RecordingOptions {
  fps: number
  quality: "low" | "medium" | "high"
  includeAudio: boolean
}

export interface Recording {
  id: string
  name: string
  duration: number
  size: string
  createdAt: Date
  blob?: Blob
}

export class ScreenRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private startTime = 0

  async startRecording(options: RecordingOptions): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: options.fps,
        },
        audio: options.includeAudio,
      })

      const mimeType = this.getSupportedMimeType()
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: this.getBitrate(options.quality),
      })

      this.chunks = []
      this.startTime = Date.now()

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data)
        }
      }

      this.mediaRecorder.start(1000) // Collect data every second
    } catch (error) {
      console.error("Failed to start recording:", error)
      throw error
    }
  }

  async stopRecording(): Promise<Recording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"))
        return
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.getSupportedMimeType() })
        const duration = Date.now() - this.startTime
        const size = this.formatBytes(blob.size)

        const recording: Recording = {
          id: Date.now().toString(),
          name: `Recording ${new Date().toLocaleTimeString()}`,
          duration,
          size,
          createdAt: new Date(),
          blob,
        }

        // Stop all tracks
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach((track) => track.stop())
        }

        resolve(recording)
      }

      this.mediaRecorder.stop()
    })
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording"
  }

  private getSupportedMimeType(): string {
    const types = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"]
    return types.find((type) => MediaRecorder.isTypeSupported(type)) || "video/webm"
  }

  private getBitrate(quality: "low" | "medium" | "high"): number {
    const bitrates = {
      low: 1000000, // 1 Mbps
      medium: 2500000, // 2.5 Mbps
      high: 5000000, // 5 Mbps
    }
    return bitrates[quality]
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }
}

export function downloadRecording(recording: Recording) {
  if (!recording.blob) return

  const url = URL.createObjectURL(recording.blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${recording.name}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
