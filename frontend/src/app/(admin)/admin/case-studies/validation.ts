import * as z from "zod";

export const caseStudiesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  client: z.string().min(1, "Client is required"),
  challenge: z.string().min(1, "Challenge is required"),
  solution: z.string().min(1, "Solution is required"),
  results: z.string().min(1, "Results are required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type CaseStudiesFormValues = z.infer<typeof caseStudiesSchema>;
