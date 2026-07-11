"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { caseStudiesConfig } from "./config"

const Crud = createCrud(caseStudiesConfig);

export default function CaseStudiesPage() {
  return <Crud />;
}
