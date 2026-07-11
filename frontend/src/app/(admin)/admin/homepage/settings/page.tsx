"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { settingsConfig } from "./settings.config"

const Crud = createCrud(settingsConfig);
export default function () {
  return <Crud />;
}
