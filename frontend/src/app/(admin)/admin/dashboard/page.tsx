'use client'

import {
  Users,
  Briefcase,
  MessageSquare,
  Mail,
  Activity,
  HardDrive,
  FileText
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import dynamic from 'next/dynamic'
import { DashboardCard } from '@/components/admin/dashboard/DashboardCard'
import { ActivityCard, ActivityItem } from '@/components/admin/dashboard/ActivityCard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardWidgetsQuery } from "@/lib/query/dashboard/queries"

// recharts pulls in d3 internals — keep it out of the initial admin
// bundle since the chart is below the fold and irrelevant to first paint.
const ContentStatusChart = dynamic(
  () => import('@/components/admin/dashboard/ContentStatusChart').then((mod) => mod.ContentStatusChart),
  { ssr: false, loading: () => <div className="h-full w-full bg-muted/30 rounded animate-pulse" /> }
)

const healthTrend = (status?: string): 'up' | 'down' | 'neutral' => {
  if (status === 'ok') return 'up'
  if (status === 'critical' || status === 'warning') return 'down'
  return 'neutral'
}

export default function DashboardPage() {
  const { data, isLoading: loading } = useDashboardWidgetsQuery()

  const kpis = data?.kpis
  const systemHealth = data?.system_health
  const storage = data?.storage
  const activity = data?.activity

  const activityData: ActivityItem[] = (activity?.entries ?? []).slice(0, 8).map((entry) => ({
    id: entry.id,
    action: entry.subject_label
      ? `${entry.action} "${entry.subject_label}"`
      : entry.action,
    time: formatDistanceToNow(new Date(entry.at), { addSuffix: true }),
    user: entry.actor || 'System',
  }))

  const contentChartData = kpis
    ? [
        { name: 'Published', value: kpis.content.published },
        { name: 'Draft', value: kpis.content.draft },
        { name: 'Scheduled', value: kpis.content.scheduled },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your enterprise portfolio metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Active Sessions"
          value={kpis?.users.active_sessions ?? "0"}
          icon={Users}
          loading={loading}
          change="last 24h"
          trend="neutral"
        />
        <DashboardCard
          title="Published Content"
          value={kpis?.content.published ?? "0"}
          icon={Briefcase}
          loading={loading}
          change={kpis ? `${kpis.content.draft} draft, ${kpis.content.scheduled} scheduled` : undefined}
          trend="neutral"
        />
        <DashboardCard
          title="Total Content Items"
          value={kpis?.content.total ?? "0"}
          icon={FileText}
          loading={loading}
        />
        <DashboardCard
          title="New Leads"
          value={kpis?.crm.new_leads ?? "0"}
          icon={MessageSquare}
          loading={loading}
          change="unactioned"
          trend={kpis && kpis.crm.new_leads > 0 ? "up" : "neutral"}
        />
        <DashboardCard
          title="Subscribers"
          value={kpis?.newsletter.subscribers ?? "0"}
          icon={Mail}
          loading={loading}
        />
        <DashboardCard
          title="Total Users"
          value={kpis?.users.total ?? "0"}
          icon={Users}
          loading={loading}
        />
        <DashboardCard
          title="System Health"
          value={systemHealth?.label ?? "Unknown"}
          icon={Activity}
          loading={loading}
          trend={healthTrend(systemHealth?.status)}
          change={systemHealth ? `${systemHealth.passing}/${systemHealth.total} checks passing` : undefined}
          changeLabel=""
        />
        <DashboardCard
          title="Storage Used"
          value={storage?.total.label ?? "0 GB"}
          icon={HardDrive}
          loading={loading}
          change={storage ? `${storage.media_files} media files` : undefined}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-background border-border/50">
          <CardHeader>
            <CardTitle>Content Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80 border-t border-border/50 mt-4 pt-4">
            {loading ? (
              <div className="h-full w-full bg-muted/30 rounded animate-pulse" />
            ) : contentChartData.length > 0 ? (
              <ContentStatusChart data={contentChartData} />
            ) : (
              <p className="text-muted-foreground text-sm h-full flex items-center justify-center">
                No content data available.
              </p>
            )}
          </CardContent>
        </Card>

        <ActivityCard
          title="Recent Activity"
          activities={activityData}
          loading={loading}
        />
      </div>
    </div>
  )
}
