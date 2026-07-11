"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Service } from "./types"

export const columns: ColumnDef<Service, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "icon",
    header: "Icon",
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (row.getValue("featured") ? "Yes" : "No"),
  },
]
