"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { blogConfig } from "./config"

const Crud = createCrud(blogConfig);

export default function BlogPage() {
  return <Crud />;
}
