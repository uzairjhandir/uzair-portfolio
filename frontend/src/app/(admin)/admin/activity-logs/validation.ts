import * as z from "zod";

export const activityLogsSchema = z.object({
  id: z.string().optional(),
});

export type ActivityLogsFormValues = z.infer<typeof activityLogsSchema>;
