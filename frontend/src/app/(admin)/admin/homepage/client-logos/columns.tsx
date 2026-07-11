"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ClientLogos } from "./types"

export const columns: ColumnDef<ClientLogos, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
