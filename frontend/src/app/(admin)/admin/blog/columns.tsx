import { ColumnDef } from "@tanstack/react-table";
import { BlogRecord } from "./types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const blogColumns: ColumnDef<BlogRecord>[] = [
  {
    accessorKey: "featured_image",
    header: "Cover",
    cell: ({ row }) => (
      <div className="w-12 h-8 rounded overflow-hidden bg-muted">
        {row.original.featured_image ? (
          <img src={row.original.featured_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>
    )
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">{row.original.slug}</p>
      </div>
    )
  },
  {
    accessorKey: "author_id",
    header: "Author",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarFallback>{row.original.author_id.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm">{row.original.author_id}</span>
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />
  },
  {
    accessorKey: "published_at",
    header: "Published",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.published_at ? new Date(row.original.published_at).toLocaleDateString() : "—"}
      </span>
    )
  }
];
