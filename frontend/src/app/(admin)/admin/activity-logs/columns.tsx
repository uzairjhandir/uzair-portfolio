import { ColumnDef } from "@tanstack/react-table";
import { ActivityLogsRecord } from "./types";
import { Badge } from "@/components/ui/badge";

export const activityLogsColumns: ColumnDef<ActivityLogsRecord>[] = [
  {
    accessorKey: "created_at",
    header: "Date/Time",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {new Date(row.original.created_at).toLocaleString()}
      </span>
    )
  },
  {
    accessorKey: "user_name",
    header: "User",
    cell: ({ row }) => <span className="font-medium">{row.original.user_name}</span>
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.action.toLowerCase();
      const variant = action.includes("delete") ? "destructive" : action.includes("create") ? "default" : "secondary";
      return <Badge variant={variant as any} className="capitalize">{row.original.action}</Badge>
    }
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => <span className="text-sm capitalize">{row.original.module}</span>
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
    cell: ({ row }) => <span className="text-sm font-mono text-muted-foreground">{row.original.ip_address}</span>
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => <span className="text-sm truncate max-w-[200px] block">{row.original.details}</span>
  }
];
