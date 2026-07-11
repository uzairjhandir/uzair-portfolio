import { ColumnDef } from "@tanstack/react-table";
import { NewsletterRecord } from "./types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const newsletterColumns: ColumnDef<NewsletterRecord>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="font-medium">{row.original.email}</span>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />
  },
  {
    accessorKey: "subscribed_at",
    header: "Subscribed Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.subscribed_at ? new Date(row.original.subscribed_at).toLocaleDateString() : "—"}
      </span>
    )
  }
];
