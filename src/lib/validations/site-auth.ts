import { z } from "zod";

export const siteRegisterSchema = z.object({
  email: z.string().trim().email("请输入正确的邮箱地址。"),
  password: z.string().min(8, "密码至少需要 8 位。").max(64),
  nickname: z
    .string()
    .trim()
    .max(40, "昵称最多 40 个字符。")
    .optional()
    .transform((value) => value || undefined),
});

export type SiteRegisterInput = z.infer<typeof siteRegisterSchema>;
