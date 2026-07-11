"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { faqConfig } from "./faq.config"

const Crud = createCrud(faqConfig);
export default function () {
  return <Crud />;
}
