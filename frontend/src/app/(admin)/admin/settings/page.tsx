"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { settingsConfig } from "./config"

const Crud = createCrud(settingsConfig);

export default function SettingsPage() {
  return <Crud />;
}
