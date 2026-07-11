"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, HardDrive, Cpu, Database, Server, Clock, GitCommit, Layers } from "lucide-react"

export default function SystemHealthPage() {
  const metrics = [
    { title: "CPU Usage", value: "24%", icon: Cpu, desc: "4 Cores active" },
    { title: "Memory", value: "3.2 / 8 GB", icon: Activity, desc: "Healthy" },
    { title: "Disk Space", value: "45% Full", icon: HardDrive, desc: "120 GB remaining" },
    { title: "Database", value: "Connected", icon: Database, desc: "5ms latency" },
    { title: "Redis Cache", value: "Active", icon: Layers, desc: "Hit rate 98%" },
    { title: "Queue Jobs", value: "0 Pending", icon: Server, desc: "Workers idle" },
    { title: "Uptime", value: "99.99%", icon: Clock, desc: "14 days, 2 hours" },
    { title: "App Version", value: "v2.4.0", icon: GitCommit, desc: "Latest branch: main" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground text-sm mt-2">Real-time monitoring of application infrastructure and resources.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
              <m.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-md text-muted-foreground text-sm">
            Log stream visualization (Placeholder)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
