import * as React from "react"
import { Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ImagePickerProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

/**
 * Architectural abstraction for Image Picker.
 * Delegates actual upload logic to MediaService so it can be swapped to S3/Cloudflare R2 later.
 */
export function ImagePicker({ value, onChange, disabled }: ImagePickerProps) {
  // In future, clicking this will open a MediaLibrary modal which uses MediaService
  
  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative group rounded-md border overflow-hidden aspect-video w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Picked media" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={() => onChange("")} // Replace with open media library logic
            >
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full max-w-sm aspect-video flex flex-col items-center justify-center gap-2 border-dashed"
          disabled={disabled}
          onClick={() => {
            // Placeholder: simulate selecting an image via MediaService
            onChange("https://placehold.co/600x400/png?text=Media+Library+Placeholder")
          }}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Select from Media Library</span>
        </Button>
      )}
    </div>
  )
}
