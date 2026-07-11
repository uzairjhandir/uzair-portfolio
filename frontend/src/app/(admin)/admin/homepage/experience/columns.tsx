"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Experience } from "./types"

export const columns: ColumnDef<Experience, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
