import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ElementType<{ className?: string }>
  change?: string
  trend?: "up" | "down" | "neutral"
  changeLabel?: string
  loading?: boolean
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  change,
  trend = "neutral",
  changeLabel = "from last month",
  loading = false,
}: DashboardCardProps) {
  return (
    <Card className="bg-background border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
        
        {change && !loading && (
          <p
            className={`text-xs mt-1 font-medium ${
              trend === "up"
                ? "text-green-500"
                : trend === "down"
                ? "text-rose-500"
                : "text-muted-foreground"
            }`}
          >
            {change} <span className="text-muted-foreground font-normal ml-1">{changeLabel}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
