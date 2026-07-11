"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { testimonialsConfig } from "./testimonials.config"

const Crud = createCrud(testimonialsConfig);
export default function () {
  return <Crud />;
}
