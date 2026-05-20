"use client"

import { X, Video, Square, Download, Trash2, Play } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"
import { ScreenRecorder, type Recording, type RecordingOptions, downloadRecording } from "@/lib/screen-recorder"

interface ScreenRecorderPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ScreenRecorderPanel({ isOpen, onClose }: ScreenRecorderPanelProps) {
  const { translate } = useBrowser()
  const [recorder] = useState(() => new ScreenRecorder())
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [options, setOptions] = useState<RecordingOptions>({
    fps: 30,
    quality: "medium",
    includeAudio: false,
  })

  if (!isOpen) return null

  const handleStartRecording = async () => {
    try {
      await recorder.startRecording(options)
      setIsRecording(true)
      playSound("success")
    } catch (error) {
      console.error("Failed to start recording:", error)
      playSound("error")
    }
  }

  const handleStopRecording = async () => {
    try {
      const recording = await recorder.stopRecording()
      setRecordings((prev) => [recording, ...prev])
      setIsRecording(false)
      playSound("pop")
    } catch (error) {
      console.error("Failed to stop recording:", error)
      playSound("error")
    }
  }

  const handleDownload = (recording: Recording) => {
    downloadRecording(recording)
    playSound("success")
  }

  const handleDelete = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id))
    playSound("pop")
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {translate("screenRecorder") || "Screen Recorder"}
            </h2>
          </div>
          <button
            onClick={() => {
              playSound("whoosh")
              onClose()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Recording Controls */}
        <div className="border-b border-border p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={options.quality}
                onChange={(e) => setOptions({ ...options, quality: e.target.value as any })}
                disabled={isRecording}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              >
                <option value="low">Low Quality</option>
                <option value="medium">Medium Quality</option>
                <option value="high">High Quality</option>
              </select>
              <select
                value={options.fps}
                onChange={(e) => setOptions({ ...options, fps: Number(e.target.value) })}
                disabled={isRecording}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              >
                <option value={15}>15 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeAudio}
                  onChange={(e) => setOptions({ ...options, includeAudio: e.target.checked })}
                  disabled={isRecording}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Include Audio</span>
              </label>
            </div>
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={cn(
                "flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all active:scale-95",
                isRecording
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Start Recording
                </>
              )}
            </button>
          </div>

          {isRecording && (
            <div className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-500">Recording in progress...</span>
            </div>
          )}
        </div>

        {/* Recordings List */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="mb-4 font-semibold text-foreground">
            {translate("recordings") || "Recordings"} ({recordings.length})
          </h3>
          {recordings.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <Video className="mb-4 h-12 w-12 opacity-50" />
              <p>{translate("noRecordings") || "No recordings yet"}</p>
              <p className="mt-2 text-sm">{translate("startRecording") || "Start a recording to get started"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recordings.map((recording, index) => (
                <div
                  key={recording.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-secondary/50 p-4 animate-stagger-fade-in hover:border-primary/50 transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{recording.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(recording.duration)} • {recording.size}
                    </p>
                    <p className="text-xs text-muted-foreground">{recording.createdAt.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(recording)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(recording.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
