import { z } from "zod";

import { HOME_SECTION_MAX_ITEMS } from "@/lib/home-sections";

function createVideoIdArraySchema() {
  return z
    .array(z.string().trim().min(1))
    .max(HOME_SECTION_MAX_ITEMS, `每个区块最多只能选择 ${HOME_SECTION_MAX_ITEMS} 个视频。`)
    .refine(
      (items) => new Set(items).size === items.length,
      "同一个区块内不能重复选择视频。",
    );
}

export const adminHomeSectionsSchema = z
  .object({
    hotVideoIds: createVideoIdArraySchema(),
    editorVideoIds: createVideoIdArraySchema(),
  })
  .refine(
    (input) =>
      input.hotVideoIds.every((videoId) => !input.editorVideoIds.includes(videoId)),
    "同一个视频不能同时出现在热门推荐和站长精选里。",
  );

export type AdminHomeSectionsInput = z.infer<typeof adminHomeSectionsSchema>;
