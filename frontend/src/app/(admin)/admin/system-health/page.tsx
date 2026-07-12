"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react"
import { useSystemHealthQuery, HealthCheckResultDto } from "@/lib/query/system-health/queries"

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  ok: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
  unknown: HelpCircle,
}

const STATUS_COLOR: Record<string, string> = {
  ok: "text-green-500",
  warning: "text-yellow-500",
  critical: "text-red-500",
  unknown: "text-muted-foreground",
}

function CheckCard({ check }: { check: HealthCheckResultDto }) {
  const Icon = STATUS_ICON[check.status] ?? HelpCircle;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{check.label}</CardTitle>
        <Icon className={`h-4 w-4 ${STATUS_COLOR[check.status]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-semibold">{check.status_label}</div>
        <p className="text-xs text-muted-foreground mt-1">{check.message}</p>
      </CardContent>
    </Card>
  )
}

export default function SystemHealthPage() {
  const { data: report, isLoading, isError } = useSystemHealthQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground text-sm mt-2">Real-time infrastructure checks from /health/details.</p>
        </div>
        {report && (
          <Badge
            variant={report.status === "ok" ? "default" : "destructive"}
            className="text-sm px-4 py-1.5"
          >
            Score: {report.score}/100 — {report.label}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading health checks...</p>
      ) : isError || !report ? (
        <p className="text-red-500 text-sm">Failed to load system health.</p>
      ) : (
        <>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{report.total} checks</span>
            <span className="text-green-500">{report.passing} passing</span>
            <span className="text-yellow-500">{report.warnings} warnings</span>
            <span className="text-red-500">{report.critical} critical</span>
            <span>{report.unknown} unknown</span>
          </div>

          {Object.entries(report.groups).map(([group, checks]) => (
            <div key={group} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{group}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {checks.map((check) => (
                  <CheckCard key={check.name} check={check} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
