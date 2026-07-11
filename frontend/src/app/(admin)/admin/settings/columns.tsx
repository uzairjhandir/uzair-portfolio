import { ColumnDef } from "@tanstack/react-table";
import { SettingsRecord } from "./types";
import { Badge } from "@/components/ui/badge";

export const settingsColumns: ColumnDef<SettingsRecord>[] = [
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.group}</Badge>
  },
  {
    accessorKey: "key",
    header: "Key",
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.key}</span>
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => <span className="text-sm truncate max-w-[300px] block">{row.original.value}</span>
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.description}</span>
  }
];
