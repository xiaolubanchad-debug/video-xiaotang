import { z } from "zod";

export const siteCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "评论至少需要 2 个字。")
    .max(500, "评论最多 500 个字。"),
});

export type SiteCommentInput = z.infer<typeof siteCommentSchema>;
