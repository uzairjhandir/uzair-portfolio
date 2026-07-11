import * as z from "zod";

export const settingsSchema = z.object({
  group: z.enum(["general", "seo", "social", "email", "analytics", "security", "storage", "api", "appearance"]).default("general"),
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  type: z.enum(["string", "boolean", "number", "json"]).default("string"),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
