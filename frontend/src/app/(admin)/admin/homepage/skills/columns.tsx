"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Skills } from "./types"

export const columns: ColumnDef<Skills, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
