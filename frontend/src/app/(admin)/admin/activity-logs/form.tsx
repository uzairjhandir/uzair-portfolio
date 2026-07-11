"use client"

import { ActivityLogsRecord } from "./types"

interface ActivityLogsFormProps {
  initialData?: ActivityLogsRecord
  onSubmit: (data: Partial<ActivityLogsRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function ActivityLogsForm({ initialData, mode }: ActivityLogsFormProps) {
  if (!initialData) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-muted-foreground block">Date & Time</span>
          <span className="font-medium">{new Date(initialData.created_at).toLocaleString()}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground block">User</span>
          <span className="font-medium">{initialData.user_name}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground block">Action</span>
          <span className="font-medium capitalize">{initialData.action}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground block">Module</span>
          <span className="font-medium capitalize">{initialData.module}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground block">IP Address</span>
          <span className="font-mono text-sm">{initialData.ip_address}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <span className="text-sm text-muted-foreground block mb-1">Detailed Payload</span>
        <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
          {initialData.details}
        </pre>
      </div>
    </div>
  )
}
