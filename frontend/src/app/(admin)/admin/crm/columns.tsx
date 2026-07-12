import { ColumnDef } from "@tanstack/react-table";
import { CrmContact } from "@/lib/query/crm/types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";

export const crmColumns: ColumnDef<CrmContact>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.full_name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.company || '—'}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status ? <StatusBadge status={row.original.status} /> : <span className="text-sm text-muted-foreground">—</span>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => row.original.priority ? (
      <Badge variant="outline" className="capitalize">{row.original.priority}</Badge>
    ) : <span className="text-sm text-muted-foreground">—</span>,
  },
  {
    accessorKey: "assigned_to",
    header: "Assigned To",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.assigned_to?.name || 'Unassigned'}</span>
    ),
  },
  {
    accessorKey: "activities_count",
    header: "Activities",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.activities_count}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
];
