"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/ui/tables/DataTable";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { useNotificationLogQuery } from "@/lib/query/notifications/queries";
import { NotificationLog } from "@/lib/query/notifications/types";

const STATUS_OPTIONS = ["queued", "sent", "delivered", "opened", "clicked", "failed"];
const CHANNEL_OPTIONS = ["mail", "slack", "webhook"];

export default function NotificationsPage() {
  const [status, setStatus] = useState("all");
  const [channel, setChannel] = useState("all");

  const { data, isLoading, isFetching, isError, error, refetch } = useNotificationLogQuery({
    ...(status !== "all" ? { status } : {}),
    ...(channel !== "all" ? { channel } : {}),
  });

  const columns: ColumnDef<NotificationLog>[] = [
    {
      accessorKey: "recipient_contact",
      header: "Recipient",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.recipient_contact}</p>
          <p className="text-xs text-muted-foreground">{row.original.template_key}</p>
        </div>
      ),
    },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ row }) => <span className="text-sm capitalize">{row.original.channel}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "attempts",
      header: "Attempts",
      cell: ({ row }) => <span className="text-sm">{row.original.attempts}</span>,
    },
    {
      accessorKey: "sent_at",
      header: "Sent",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.sent_at ? new Date(row.original.sent_at).toLocaleString() : "—"}
        </span>
      ),
    },
    {
      accessorKey: "opened_at",
      header: "Opened",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.opened_at ? new Date(row.original.opened_at).toLocaleString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Delivery log — read-only. No compose/send action exists; this module is driven entirely by internal service calls from other modules (Newsletter, CRM, etc.).
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            {CHANNEL_OPTIONS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading || isFetching} isError={isError} error={error} onRefresh={refetch} totalCount={data?.total} />
    </div>
  );
}
