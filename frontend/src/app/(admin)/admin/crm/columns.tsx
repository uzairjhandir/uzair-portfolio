import { ColumnDef } from "@tanstack/react-table";
import { CrmRecord } from "./types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";

export const crmColumns: ColumnDef<CrmRecord>[] = [
  {
    accessorKey: "lead",
    header: "Lead",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    )
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span className="text-sm truncate max-w-[200px] block">{row.original.subject}</span>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const p = row.original.priority;
      const color = p === "high" ? "destructive" : p === "medium" ? "default" : "secondary";
      return <Badge variant={color as any}>{p}</Badge>;
    }
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : "—"}
      </span>
    )
  }
];
