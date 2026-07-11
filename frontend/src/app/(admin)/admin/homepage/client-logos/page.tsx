"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { clientLogosConfig } from "./client-logos.config"

const Crud = createCrud(clientLogosConfig);
export default function () {
  return <Crud />;
}
