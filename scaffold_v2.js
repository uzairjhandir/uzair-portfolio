const fs = require('fs');
const path = require('path');

const modules = [
  'blog', 'portfolio', 'case-studies', 'users', 'roles', 
  'crm', 'newsletter', 'media', 'settings', 'system-health', 'activity-logs'
];

const basePath = path.join(__dirname, 'src', 'app', '(admin)', 'admin');

modules.forEach(mod => {
  const modPath = path.join(basePath, mod);
  if (!fs.existsSync(modPath)) {
    fs.mkdirSync(modPath, { recursive: true });
  }

  const nameCamel = mod.replace(/-([a-z])/g, g => g[1].toUpperCase());
  const namePascal = nameCamel.charAt(0).toUpperCase() + nameCamel.slice(1);
  const nameTitle = mod.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // 1. types.ts
  const typesContent = `export interface ${namePascal}Record {
  id: string;
  created_at?: string;
  updated_at?: string;
}
`;
  fs.writeFileSync(path.join(modPath, 'types.ts'), typesContent);

  // 2. validation.ts
  const validationContent = `import * as z from "zod";

export const ${nameCamel}Schema = z.object({
  id: z.string().optional(),
});

export type ${namePascal}FormValues = z.infer<typeof ${nameCamel}Schema>;
`;
  fs.writeFileSync(path.join(modPath, 'validation.ts'), validationContent);

  // 3. mock.ts
  const mockContent = `import { ${namePascal}Record } from "./types";

export const mock${namePascal}: ${namePascal}Record[] = [
  { id: "1", created_at: new Date().toISOString() }
];
`;
  fs.writeFileSync(path.join(modPath, 'mock.ts'), mockContent);

  // 4. columns.tsx
  const columnsContent = `import { ColumnDef } from "@tanstack/react-table";
import { ${namePascal}Record } from "./types";

export const ${nameCamel}Columns: ColumnDef<${namePascal}Record>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
];
`;
  fs.writeFileSync(path.join(modPath, 'columns.tsx'), columnsContent);

  // 5. form.tsx
  const formContent = `"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ${namePascal}FormValues, ${nameCamel}Schema } from "./validation"
import { ${namePascal}Record } from "./types"

interface ${namePascal}FormProps {
  initialData?: ${namePascal}Record
  onSubmit: (data: Partial<${namePascal}Record>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function ${namePascal}Form({ initialData, onSubmit, isSubmitting, mode }: ${namePascal}FormProps) {
  const form = useForm<${namePascal}FormValues>({
    resolver: zodResolver(${nameCamel}Schema) as any,
    defaultValues: initialData || {},
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
        {/* Form fields will go here */}
        {mode !== "view" && (
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create" : mode === "clone" ? "Clone" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
`;
  fs.writeFileSync(path.join(modPath, 'form.tsx'), formContent);

  // 6. config.ts
  const configContent = `import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { ${namePascal}Record } from "./types"
import { ${nameCamel}Columns } from "./columns"
import { ${namePascal}Form } from "./form"

export const ${nameCamel}Config: CrudConfig<${namePascal}Record> = {
  resource: "${mod}",
  title: "${nameTitle}",
  endpoint: "/api/v1/admin/${mod}",
  queryKey: ["${mod}"],
  columns: ${nameCamel}Columns,
  FormComponent: ${namePascal}Form,
  permissions: {
    view: "${mod}.view",
    create: "${mod}.create",
    edit: "${mod}.edit",
    delete: "${mod}.delete"
  }
}
`;
  fs.writeFileSync(path.join(modPath, 'config.ts'), configContent);

  // 7. page.tsx
  const pageContent = `"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { ${nameCamel}Config } from "./config"

const Crud = createCrud(${nameCamel}Config);

export default function ${namePascal}Page() {
  return <Crud />;
}
`;
  fs.writeFileSync(path.join(modPath, 'page.tsx'), pageContent);

  console.log(`Scaffolded ${mod}`);
});
