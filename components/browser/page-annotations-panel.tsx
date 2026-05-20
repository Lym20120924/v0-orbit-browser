"use client"

import { useState, useEffect } from "react"
import { StickyNote, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PageAnnotationManager, type Annotation } from "@/lib/page-annotations"
import { playSound } from "@/lib/sounds"
import { useLanguage } from "@/lib/i18n"

const annotationManager = new PageAnnotationManager()

interface PageAnnotationsPanelProps {
  isOpen: boolean
  onClose: () => void
  url: string
}

export function PageAnnotationsPanel({ isOpen, onClose, url: currentUrl }: PageAnnotationsPanelProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [newNote, setNewNote] = useState("")
  const [selectedColor, setSelectedColor] = useState("#fbbf24")
  const [searchTag, setSearchTag] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    if (isOpen) {
      loadAnnotations()
    }
  }, [isOpen, currentUrl])

  const loadAnnotations = () => {
    const notes = annotationManager.getAnnotations(currentUrl)
    setAnnotations(notes)
  }

  const addAnnotation = () => {
    if (newNote.trim()) {
      annotationManager.addAnnotation(
        currentUrl,
        newNote,
        { x: Math.random() * 100, y: Math.random() * 100 },
        selectedColor,
      )
      setNewNote("")
      loadAnnotations()
      playSound("pop")
    }
  }

  const deleteAnnotation = (id: string) => {
    annotationManager.deleteAnnotation(id)
    loadAnnotations()
    playSound("click")
  }

  const colors = ["#fbbf24", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"]

  if (!isOpen) return null

  return (
    <div className="absolute right-4 top-16 w-96 bg-background border border-border rounded-lg shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col animate-slide-in-right">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          <h3 className="font-semibold">{t("pageAnnotations")}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={t("writeNote")}
            rows={3}
            className="animate-fade-in"
          />

          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color ? "border-foreground scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>

          <Button onClick={addAnnotation} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {t("addNote")}
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            {t("notes")} ({annotations.length})
          </h4>
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="p-3 rounded-lg border animate-fade-in hover:shadow-md transition-shadow"
              style={{ borderLeftColor: annotation.color, borderLeftWidth: "4px" }}
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm flex-1">{annotation.text}</p>
                <Button variant="ghost" size="sm" onClick={() => deleteAnnotation(annotation.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{new Date(annotation.timestamp).toLocaleString()}</p>
            </div>
          ))}

          {annotations.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">{t("noNotes")}</p>}
        </div>
      </div>
    </div>
  )
}
