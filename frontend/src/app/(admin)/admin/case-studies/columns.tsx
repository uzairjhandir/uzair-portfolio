import { ColumnDef } from "@tanstack/react-table";
import { CaseStudiesRecord } from "./types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const caseStudiesColumns: ColumnDef<CaseStudiesRecord>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">{row.original.client}</p>
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />
  },
];
