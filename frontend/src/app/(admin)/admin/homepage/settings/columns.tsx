"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Settings } from "./types"

export const columns: ColumnDef<Settings, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
