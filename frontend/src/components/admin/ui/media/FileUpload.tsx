import * as React from "react"
import { UploadCloud, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUploadMediaMutation } from "@/lib/query/media/mutations";

export interface FileUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  accept?: string
}

/**
 * Architectural abstraction for Generic File Upload.
 * Supports Documents, PDFs, ZIPs, Videos.
 */
export function FileUpload({ value, onChange, disabled, accept = "*/*" }: FileUploadProps) {
  const uploadMutation = useUploadMediaMutation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/50 max-w-sm">
          <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary rounded flex items-center justify-center">
            <File className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.split('/').pop() || 'Uploaded File'}</p>
            <p className="text-xs text-muted-foreground">Attached successfully</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={disabled}
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="w-full max-w-sm rounded-md border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
        >
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {uploadMutation.isPending ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">Supported: {accept}</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept={accept}
            onChange={async (e) => {
              if (e.target.files?.[0]) {
                const response = await uploadMutation.mutateAsync(e.target.files[0]);
                if (response?.data?.url) {
                  onChange(response.data.url);
                }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
