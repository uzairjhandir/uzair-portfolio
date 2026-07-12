import { ColumnDef } from "@tanstack/react-table";
import { DownloadItem } from "@/lib/query/downloads/types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const downloadColumns: ColumnDef<DownloadItem>[] = [
  {
    accessorKey: "preview_image",
    header: "Cover",
    cell: ({ row }) => (
      <div className="w-12 h-8 rounded overflow-hidden bg-muted">
        {row.original.preview_image?.original_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.original.preview_image.original_url} alt="Cover" className="w-full h-full object-cover" />
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
    accessorKey: "latest_version",
    header: "Version",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.latest_version || '—'}</span>
    ),
  },
  {
    accessorKey: "categories",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.categories[0]?.name || '—'}
      </span>
    ),
  },
  {
    accessorKey: "download_count",
    header: "Downloads",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.download_count}</span>
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
