import * as React from "react"
import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading data..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
