"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { heroConfig } from "./hero.config"

const Crud = createCrud(heroConfig);
export default function () {
  return <Crud />;
}
