"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { processConfig } from "./process.config"

const Crud = createCrud(processConfig);
export default function () {
  return <Crud />;
}
