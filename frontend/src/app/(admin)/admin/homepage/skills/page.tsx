"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { skillsConfig } from "./skills.config"

const Crud = createCrud(skillsConfig);
export default function () {
  return <Crud />;
}
