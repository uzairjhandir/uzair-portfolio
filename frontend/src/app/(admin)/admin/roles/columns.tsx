import { ColumnDef } from "@tanstack/react-table";
import { RolesRecord } from "./types";
import { Badge } from "@/components/ui/badge";

export const rolesColumns: ColumnDef<RolesRecord>[] = [
  {
    accessorKey: "name",
    header: "Role",
    cell: ({ row }) => (
      <div>
        <p className="font-medium capitalize">{row.original.name.replace("_", " ")}</p>
        {row.original.description && (
          <p className="text-xs text-muted-foreground">{row.original.description}</p>
        )}
      </div>
    )
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.permissions.slice(0, 3).map(p => (
          <Badge variant="secondary" key={p} className="text-[10px]">{p}</Badge>
        ))}
        {row.original.permissions.length > 3 && (
          <Badge variant="outline" className="text-[10px]">+{row.original.permissions.length - 3} more</Badge>
        )}
      </div>
    )
  }
];
