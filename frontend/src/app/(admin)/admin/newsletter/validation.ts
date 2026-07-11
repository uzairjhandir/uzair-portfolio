import * as z from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
  status: z.enum(["subscribed", "unsubscribed", "bounced"]).default("subscribed"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
