"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { experienceConfig } from "./experience.config"

const Crud = createCrud(experienceConfig);
export default function () {
  return <Crud />;
}
