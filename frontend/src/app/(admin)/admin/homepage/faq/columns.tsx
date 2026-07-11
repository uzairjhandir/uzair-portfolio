"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Faq } from "./types"

export const columns: ColumnDef<Faq, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
