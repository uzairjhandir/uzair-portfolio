import * as z from "zod";

export const crmSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  source: z.string().default("website"),
  status: z.enum(["new", "contacted", "qualified", "lost", "won"]).default("new"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assigned_to: z.string().optional(),
  notes: z.string().optional(),
});

export type CrmFormValues = z.infer<typeof crmSchema>;
