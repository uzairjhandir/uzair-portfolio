"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { crmConfig } from "./config"

const Crud = createCrud(crmConfig);

export default function CrmPage() {
  return <Crud />;
}
