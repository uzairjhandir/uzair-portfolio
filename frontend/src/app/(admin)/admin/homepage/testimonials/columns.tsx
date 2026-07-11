"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Testimonials } from "./types"

export const columns: ColumnDef<Testimonials, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
