"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { rolesConfig } from "./config"

const Crud = createCrud(rolesConfig);

export default function RolesPage() {
  return <Crud />;
}
