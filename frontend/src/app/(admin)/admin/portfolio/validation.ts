import * as z from "zod";

export const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  client: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).default([]),
  featured_image: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  github_url: z.string().url().optional().or(z.literal("")),
  live_url: z.string().url().optional().or(z.literal("")),
  case_study_id: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
