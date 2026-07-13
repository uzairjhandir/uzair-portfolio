import * as React from "react"
import { ShieldAlert } from "lucide-react"

interface PermissionDeniedProps {
  title?: string
  message?: string
}

export function PermissionDenied({
  title = "Access Denied",
  message = "You don't have permission to view this content. Contact an administrator if you believe this is a mistake.",
}: PermissionDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-amber-500/20 bg-amber-500/5 rounded-lg min-h-[300px]">
      <div className="w-12 h-12 mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
        <ShieldAlert className="w-6 h-6 text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold text-amber-500">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {message}
      </p>
    </div>
  )
}
