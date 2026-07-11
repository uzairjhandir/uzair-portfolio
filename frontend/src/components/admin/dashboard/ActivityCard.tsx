import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export interface ActivityItem {
  id: string | number
  action: string
  time: string
  user: string
}

interface ActivityCardProps {
  title?: string
  activities: ActivityItem[]
  loading?: boolean
}

export function ActivityCard({ title = "Recent Activity", activities, loading = false }: ActivityCardProps) {
  return (
    <Card className="bg-background border-border/50 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start animate-pulse">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
