import * as z from "zod";

export const usersSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  avatar: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["active", "inactive", "suspended"]),
});

export type UsersFormValues = z.infer<typeof usersSchema>;
