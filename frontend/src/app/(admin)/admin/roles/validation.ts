import * as z from "zod";

export const rolesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});

export type RolesFormValues = z.infer<typeof rolesSchema>;
