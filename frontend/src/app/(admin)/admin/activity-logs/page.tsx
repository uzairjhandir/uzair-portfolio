"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { activityLogsConfig } from "./config"

const Crud = createCrud(activityLogsConfig);

export default function ActivityLogsPage() {
  return <Crud />;
}
