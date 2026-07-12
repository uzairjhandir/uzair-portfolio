import * as React from "react"
import { FolderX } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  icon?: React.ElementType<{ className?: string }>
}

export function EmptyState({ 
  title = "No data found", 
  description = "Get started by creating a new record.", 
  action, 
  icon: Icon = FolderX 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/10">
      <div className="w-12 h-12 mb-4 rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
        {description}
      </p>
      {action}
    </div>
  )
}
