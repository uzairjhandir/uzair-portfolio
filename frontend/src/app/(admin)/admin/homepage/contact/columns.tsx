"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Contact } from "./types"

export const columns: ColumnDef<Contact, unknown>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
]
