import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<any>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
];