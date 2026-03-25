import { CommentStatus } from "@prisma/client";
import { z } from "zod";

export const adminCommentStatusSchema = z.object({
  status: z.nativeEnum(CommentStatus).refine(
    (status) => status !== CommentStatus.PENDING,
    "评论状态只能更新为 APPROVED 或 HIDDEN。",
  ),
});

export type AdminCommentStatusInput = z.infer<typeof adminCommentStatusSchema>;
