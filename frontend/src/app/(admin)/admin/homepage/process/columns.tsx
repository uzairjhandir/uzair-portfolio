"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Process } from "./types"

export const columns: ColumnDef<Process, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
