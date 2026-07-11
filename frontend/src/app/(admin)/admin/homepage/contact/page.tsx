"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { contactConfig } from "./contact.config"

const Crud = createCrud(contactConfig);
export default function () {
  return <Crud />;
}
