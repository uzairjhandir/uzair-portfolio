"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { newsletterConfig } from "./config"

const Crud = createCrud(newsletterConfig);

export default function NewsletterPage() {
  return <Crud />;
}
