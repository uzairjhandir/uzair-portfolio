'use client'

import { useState, useEffect } from "react"
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Activity, 
  HardDrive,
  Globe,
  FileText
} from 'lucide-react'
import { DashboardCard } from '@/components/admin/dashboard/DashboardCard'
import { ActivityCard, ActivityItem } from '@/components/admin/dashboard/ActivityCard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardStatsQuery } from "@/lib/query/dashboard/queries"

export default function DashboardPage() {
  const { data: stats, isLoading: loading } = useDashboardStatsQuery()

  const activityData: ActivityItem[] = [
    { id: 1, action: 'New lead from website', time: '10 mins ago', user: 'System' },
    { id: 2, action: 'Case Study "WooCommerce" published', time: '2 hours ago', user: 'Uzair' },
    { id: 3, action: 'Portfolio updated', time: '5 hours ago', user: 'Uzair' },
    { id: 4, action: 'New subscriber joined', time: '1 day ago', user: 'System' },
  ]

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
          title="Total Visitors" 
          value={stats?.visitors?.total || "0"} 
          icon={Globe} 
          loading={loading}
          change={stats?.visitors?.change || "+0%"}
          trend={stats?.visitors?.trend || "neutral"}
        />
        <DashboardCard 
          title="Active Projects" 
          value={stats?.projects?.active || "0"} 
          icon={Briefcase} 
          loading={loading}
          change={stats?.projects?.change || "+0"}
          trend={stats?.projects?.trend || "neutral"}
        />
        <DashboardCard 
          title="Published Blogs" 
          value={stats?.blogs?.published || "0"} 
          icon={FileText} 
          loading={loading}
        />
        <DashboardCard 
          title="Unread Messages" 
          value={stats?.messages?.unread || "0"} 
          icon={MessageSquare} 
          loading={loading}
          change={stats?.messages?.change || "0 urgent"}
          trend={stats?.messages?.trend || "neutral"}
        />
        <DashboardCard 
          title="Subscribers" 
          value={stats?.subscribers?.total || "0"} 
          icon={Mail} 
          loading={loading}
          change={stats?.subscribers?.change || "+0 this week"}
          trend={stats?.subscribers?.trend || "neutral"}
        />
        <DashboardCard 
          title="Admin Users" 
          value={stats?.users?.admin || "0"} 
          icon={Users} 
          loading={loading}
        />
        <DashboardCard 
          title="System Health" 
          value={stats?.system?.health || "Unknown"} 
          icon={Activity} 
          loading={loading}
          trend={stats?.system?.trend || "neutral"}
          change={stats?.system?.change || "Unknown"}
          changeLabel="status"
        />
        <DashboardCard 
          title="Storage Used" 
          value={stats?.storage?.used || "0 GB"} 
          icon={HardDrive} 
          loading={loading}
          change={stats?.storage?.change || "0% of limit"}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-background border-border/50">
          <CardHeader>
            <CardTitle>Visitor Traffic</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-border/50 mt-4">
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" /> Traffic Chart Placeholder (Recharts)
            </p>
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
