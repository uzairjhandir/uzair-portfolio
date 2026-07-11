import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  mode?: "create" | "edit" | "view" | "clone"
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  mode = "create",
}: FormDialogProps) {
  const getModeLabel = () => {
    switch (mode) {
      case "edit":
        return `Edit ${title}`
      case "view":
        return `View ${title}`
      case "clone":
        return `Clone ${title}`
      case "create":
      default:
        return `Create New ${title}`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModeLabel()}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
