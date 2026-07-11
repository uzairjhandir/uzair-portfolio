import { ColumnDef } from "@tanstack/react-table";
import { PortfolioRecord } from "./types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { ExternalLink, Link2 } from "lucide-react";

export const portfolioColumns: ColumnDef<PortfolioRecord>[] = [
  {
    accessorKey: "featured_image",
    header: "Cover",
    cell: ({ row }) => (
      <div className="w-12 h-12 rounded overflow-hidden bg-muted border">
        {row.original.featured_image ? (
          <img src={row.original.featured_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-primary/10">No Img</div>
        )}
      </div>
    )
  },
  {
    accessorKey: "title",
    header: "Project",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-xs text-muted-foreground">{row.original.client || "Personal Project"}</p>
      </div>
    )
  },
  {
    accessorKey: "links",
    header: "Links",
    cell: ({ row }) => (
      <div className="flex gap-2 text-muted-foreground">
        {row.original.live_url && (
          <a href={row.original.live_url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {row.original.github_url && (
          <a href={row.original.github_url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            <Link2 className="w-4 h-4" />
          </a>
        )}
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />
  }
];
