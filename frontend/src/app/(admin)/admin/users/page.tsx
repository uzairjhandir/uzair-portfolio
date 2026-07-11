"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { usersConfig } from "./config"

const Crud = createCrud(usersConfig);

export default function UsersPage() {
  return <Crud />;
}
