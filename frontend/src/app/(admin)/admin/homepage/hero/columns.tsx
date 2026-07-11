"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Hero } from "./types"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"

export const columns: ColumnDef<Hero, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subtitle",
    header: "Subtitle",
  },
  {
    accessorKey: "primaryCta",
    header: "Primary CTA",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (row.getValue("featured") ? "Yes" : "No"),
  },
]
