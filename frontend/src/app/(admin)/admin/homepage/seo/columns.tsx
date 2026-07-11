"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Seo } from "./types"

export const columns: ColumnDef<Seo, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
