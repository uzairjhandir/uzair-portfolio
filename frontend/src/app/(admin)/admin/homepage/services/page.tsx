"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { servicesConfig } from "./services.config"

const Crud = createCrud(servicesConfig);
export default function () {
  return <Crud />;
}
