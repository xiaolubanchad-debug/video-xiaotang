import { z } from "zod";

export const adminCategorySchema = z.object({
  name: z.string().trim().min(1, "分类名称不能为空。"),
  description: z.string().trim().optional(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  status: z.string().trim().min(1).default("ACTIVE"),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;
