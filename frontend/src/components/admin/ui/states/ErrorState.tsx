import * as React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "We encountered an error while fetching the data. Please try again.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 bg-destructive/5 rounded-lg min-h-[300px]">
      <div className="w-12 h-12 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-destructive">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  )
}
