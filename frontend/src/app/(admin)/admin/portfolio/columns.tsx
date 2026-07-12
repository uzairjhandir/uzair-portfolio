import { ColumnDef } from "@tanstack/react-table";
import { PortfolioProject } from "@/lib/query/portfolio/types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const portfolioColumns: ColumnDef<PortfolioProject>[] = [
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
    accessorKey: "client_name",
    header: "Client",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.client_name || '—'}</span>
    ),
  },
  {
    accessorKey: "technologies",
    header: "Technologies",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.original.technologies.slice(0, 3).map((t) => (
          <span key={t.uuid} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t.name}</span>
        ))}
        {row.original.technologies.length > 3 && (
          <span className="text-xs text-muted-foreground">+{row.original.technologies.length - 3}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "completion_date",
    header: "Completed",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.completion_date ? new Date(row.original.completion_date).toLocaleDateString() : "—"}
      </span>
    ),
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
