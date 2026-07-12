import { ColumnDef } from "@tanstack/react-table";
import { CaseStudy } from "@/lib/query/case-studies/types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const caseStudiesColumns: ColumnDef<CaseStudy>[] = [
  {
    accessorKey: "featured_image",
    header: "Cover",
    cell: ({ row }) => (
      <div className="w-12 h-8 rounded overflow-hidden bg-muted">
        {row.original.featured_image?.original_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.original.featured_image.original_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">{row.original.slug}</p>
      </div>
    ),
  },
  {
    accessorKey: "portfolio",
    header: "Related Portfolio",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.portfolio?.title || '—'}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.updated_at).toLocaleDateString()}
      </span>
    ),
  },
];
