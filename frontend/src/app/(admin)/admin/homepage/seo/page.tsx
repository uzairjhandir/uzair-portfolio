"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { seoConfig } from "./seo.config"

const Crud = createCrud(seoConfig);
export default function () {
  return <Crud />;
}
