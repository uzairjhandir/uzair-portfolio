import * as z from "zod";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().max(500, "Excerpt must be under 500 characters"),
  content: z.string().min(1, "Content is required"),
  featured_image: z.string().optional(),
  author_id: z.string().min(1, "Author is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().optional(),
  reading_time: z.coerce.number().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
