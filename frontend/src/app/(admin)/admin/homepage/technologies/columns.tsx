"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Technologies } from "./types"

export const columns: ColumnDef<Technologies, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
