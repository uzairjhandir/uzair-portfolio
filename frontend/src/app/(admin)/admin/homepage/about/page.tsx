"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { aboutConfig } from "./about.config"

const Crud = createCrud(aboutConfig);
export default function () {
  return <Crud />;
}
