import { z } from "zod";

export const adminTagSchema = z.object({
  name: z.string().trim().min(1, "标签名称不能为空。"),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "请输入合法的 HEX 颜色值。")
    .optional()
    .or(z.literal("")),
});

export type AdminTagInput = z.infer<typeof adminTagSchema>;
