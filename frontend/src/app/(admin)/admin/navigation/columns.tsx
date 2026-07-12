import { ColumnDef } from "@tanstack/react-table";

interface StubRow {
  id: string | number;
  title: string;
}

export const columns: ColumnDef<StubRow>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
];