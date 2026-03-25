import { BannerStatus } from "@prisma/client";
import { z } from "zod";

export const adminBannerSchema = z.object({
  title: z.string().trim().min(1, "Banner 标题不能为空。").max(120),
  imageUrl: z.string().trim().url("Banner 图片地址格式不正确。"),
  targetUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine(
      (value) => !value || /^https?:\/\//.test(value) || value.startsWith("/"),
      "跳转地址需要是 http(s) 链接或站内路径。",
    ),
  videoId: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  status: z.nativeEnum(BannerStatus).default(BannerStatus.DRAFT),
  startAt: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  endAt: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

export type AdminBannerInput = z.infer<typeof adminBannerSchema>;
