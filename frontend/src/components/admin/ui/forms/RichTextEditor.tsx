import * as React from "react"

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

/**
 * Placeholder for the Rich Text Editor.
 * This will be implemented during the Blog phase using a library like TipTap or Quill.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  readOnly = false,
}: RichTextEditorProps) {
  return (
    <div className="flex flex-col border rounded-md min-h-[200px] bg-background">
      {/* Toolbar Placeholder */}
      <div className="border-b p-2 bg-muted/50 flex gap-2">
        <div className="h-8 w-8 rounded bg-muted/80 animate-pulse" />
        <div className="h-8 w-8 rounded bg-muted/80 animate-pulse" />
        <div className="h-8 w-8 rounded bg-muted/80 animate-pulse" />
        <div className="h-8 w-8 rounded bg-muted/80 animate-pulse" />
      </div>
      {/* Editor Content Area Placeholder */}
      <textarea
        className="flex-1 p-4 bg-transparent outline-none resize-y min-h-[150px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={readOnly}
      />
    </div>
  )
}
