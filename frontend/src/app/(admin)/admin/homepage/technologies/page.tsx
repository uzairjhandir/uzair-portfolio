"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { technologiesConfig } from "./technologies.config"

const Crud = createCrud(technologiesConfig);
export default function () {
  return <Crud />;
}
