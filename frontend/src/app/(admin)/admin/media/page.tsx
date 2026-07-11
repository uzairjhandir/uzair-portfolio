"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutGrid, List, Search, UploadCloud, Folder, Image as ImageIcon, Link, Trash2, Edit2 } from "lucide-react"

export default function MediaLibraryPage() {
  const [view, setView] = useState<"grid" | "list">("grid")

  const mockFiles = [
    { id: 1, name: "hero-bg.jpg", size: "1.2 MB", type: "image/jpeg", url: "/placeholder.jpg" },
    { id: 2, name: "logo-dark.png", size: "45 KB", type: "image/png", url: "/placeholder.jpg" },
    { id: 3, name: "avatar-uzair.webp", size: "120 KB", type: "image/webp", url: "/placeholder.jpg" },
  ]

  const mockFolders = ["Uploads", "Blog", "Portfolio", "Avatars"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-2">Manage all your files, images, and documents.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Folder className="w-4 h-4 mr-2" /> New Folder</Button>
          <Button><UploadCloud className="w-4 h-4 mr-2" /> Upload Files</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Folders */}
        <Card className="w-full md:w-64 shrink-0 h-fit">
          <CardContent className="p-4 space-y-2">
            <h3 className="font-medium text-sm mb-4 text-muted-foreground">Directories</h3>
            {mockFolders.map(folder => (
              <Button key={folder} variant="ghost" className="w-full justify-start font-normal">
                <Folder className="w-4 h-4 mr-2 text-primary" />
                {folder}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md border">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input placeholder="Search media..." className="pl-9 bg-background" />
            </div>
            <div className="flex items-center gap-1 bg-background rounded-md border">
              <Button variant={view === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setView("grid")} className="h-9 px-3">
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setView("list")} className="h-9 px-3">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Grid View */}
          {view === "grid" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mockFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-square bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8"><Link className="w-4 h-4" /></Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="p-3 text-sm">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{file.size}</p>
                  </div>
                </Card>
              ))}
              
              {/* Dropzone Placeholder */}
              <div className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Drag & Drop</span>
              </div>
            </div>
          )}

          {/* List View Placeholder */}
          {view === "list" && (
            <div className="border rounded-md">
              <div className="p-8 text-center text-muted-foreground">List view not implemented in scaffold</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
