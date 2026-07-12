'use client'

import * as React from "react"
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Search, 
  Folder, 
  Grid,
  List,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useUploadMediaMutation, useDeleteMediaMutation } from "@/lib/query/media/mutations";
import { useMediaQuery as queryMediaQuery } from "@/lib/query/media/queries";
import { Media } from "@/lib/query/media/types";

const mockFolders = [
  { id: "1", name: "Images" },
  { id: "2", name: "Documents" },
]

interface MediaPickerProps {
  value?: string
  onChange?: (url: string) => void
  trigger?: React.ReactNode
}

export function MediaPicker({ value, onChange, trigger }: MediaPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [search, setSearch] = React.useState("")
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null)
  const [selectedMediaId, setSelectedMediaId] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const { data: mediaData, isLoading } = queryMediaQuery({ search });
  const mediaList = mediaData?.data || [];
  
  const uploadMutation = useUploadMediaMutation();
  const deleteMutation = useDeleteMediaMutation();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = () => {
    if (selectedMediaId) {
      const media = mediaList.find((m: Media) => m.uuid === selectedMediaId)
      if (media && onChange) {
        onChange(media.original_url)
      }
      setIsOpen(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await uploadMutation.mutateAsync({ file });
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadMutation.mutateAsync({ file });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors group">
            {value ? (
              <img src={value} alt="Selected media" className="max-h-32 rounded object-contain mb-4" />
            ) : (
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
            )}
            <p className="text-sm font-medium">Click to select media</p>
          </div>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/20 p-4 flex flex-col gap-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
              <UploadCloud className="w-4 h-4 mr-2" />
              {uploadMutation.isPending ? "Uploading..." : "Upload New"}
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
            
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-2">Folders</h4>
              <Button 
                variant={selectedFolder === null ? "secondary" : "ghost"} 
                className="w-full justify-start h-8 px-2"
                onClick={() => setSelectedFolder(null)}
              >
                <Folder className="w-4 h-4 mr-2 text-blue-500" />
                All Media
              </Button>
              {mockFolders.map(folder => (
                <Button 
                  key={folder.id} 
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"} 
                  className="w-full justify-start h-8 px-2"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Folder className="w-4 h-4 mr-2 text-muted-foreground" />
                  {folder.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search media..." 
                  className="pl-9 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button 
                  variant={view === "grid" ? "secondary" : "ghost"} 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => setView("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant={view === "list" ? "secondary" : "ghost"} 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => setView("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Media Grid/List */}
            <div 
              className={cn(
                "flex-1 overflow-y-auto p-4 transition-colors",
                isDragging ? "bg-primary/5 border-2 border-primary border-dashed" : ""
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Loading media...</div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaList.map((media: Media) => (
                    <div 
                      key={media.uuid}
                      onClick={() => setSelectedMediaId(media.uuid)}
                      className={cn(
                        "group relative aspect-square rounded-lg border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors",
                        selectedMediaId === media.uuid ? "border-primary ring-2 ring-primary/20" : ""
                      )}
                    >
                      {media.mime_type?.startsWith("image/") ? (
                        <img src={media.original_url} alt={media.file_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {media.file_name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {mediaList.map((media: Media) => (
                    <div 
                      key={media.uuid}
                      onClick={() => setSelectedMediaId(media.uuid)}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg border cursor-pointer hover:border-primary/50",
                        selectedMediaId === media.uuid ? "border-primary bg-primary/5" : "bg-card"
                      )}
                    >
                      {media.mime_type?.startsWith("image/") ? (
                        <img src={media.original_url} alt={media.file_name} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <FileText className="w-10 h-10 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{media.file_name}</p>
                        <p className="text-xs text-muted-foreground">{(media.size / 1024 / 1024).toFixed(2)} MB • {new Date(media.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Info Panel */}
          {selectedMediaId && (
            <div className="w-72 border-l bg-muted/10 p-4 flex flex-col">
              <h3 className="font-semibold mb-4">Media Details</h3>
              {(() => {
                const media = mediaList.find((m: Media) => m.uuid === selectedMediaId)
                if (!media) return null
                return (
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {media.mime_type?.startsWith("image/") ? (
                        <img src={media.original_url} alt={media.file_name} className="w-full h-full object-contain" />
                      ) : (
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium break-words">{media.file_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{(media.size / 1024 / 1024).toFixed(2)} MB • {new Date(media.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2 pt-4 border-t">
                      <Button className="w-full" onClick={handleSelect}>
                        Insert Media
                      </Button>
                      <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={async () => {
                        await deleteMutation.mutateAsync(media.uuid);
                        setSelectedMediaId(null);
                      }} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
