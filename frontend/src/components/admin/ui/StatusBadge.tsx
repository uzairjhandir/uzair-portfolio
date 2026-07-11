import * as React from "react"
import { cn } from "@/lib/utils"

type StatusVariant = "success" | "warning" | "destructive" | "default" | "info"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string
  variant?: StatusVariant
}

export function StatusBadge({ status, variant = "default", className, ...props }: StatusBadgeProps) {
  const variants: Record<StatusVariant, string> = {
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    destructive: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
    info: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    default: "bg-muted text-muted-foreground border-border",
  }

  // Auto-detect variant if not provided
  let activeVariant = variant
  if (variant === "default") {
    const text = status.toLowerCase()
    if (text === "published" || text === "active" || text === "approved") activeVariant = "success"
    if (text === "draft" || text === "pending" || text === "review") activeVariant = "warning"
    if (text === "archived" || text === "deleted" || text === "rejected") activeVariant = "destructive"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variants[activeVariant],
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        activeVariant === "success" && "bg-emerald-500",
        activeVariant === "warning" && "bg-amber-500",
        activeVariant === "destructive" && "bg-red-500",
        activeVariant === "info" && "bg-blue-500",
        activeVariant === "default" && "bg-muted-foreground",
      )} />
      {status}
    </div>
  )
}
