"use client"

import { ColumnDef } from "@tanstack/react-table"
import { About } from "./types"

export const columns: ColumnDef<About, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
