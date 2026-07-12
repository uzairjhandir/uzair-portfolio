import { ColumnDef } from "@tanstack/react-table";
import { BlogPost } from "@/lib/query/blog/types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export const blogColumns: ColumnDef<BlogPost>[] = [
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
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.author?.name || '—'}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />,
  },
  {
    accessorKey: "publish_at",
    header: "Published",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.publish_at ? new Date(row.original.publish_at).toLocaleDateString() : "—"}
      </span>
    ),
  },
];
