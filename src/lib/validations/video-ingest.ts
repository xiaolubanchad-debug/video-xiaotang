import { z } from "zod";

const sourceFormatSchema = z.enum(["mp4", "m3u8", "webm"]);

const tagObjectSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  color: z.string().trim().optional(),
});

const categoryObjectSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

const sourceSchema = z.object({
  sourceType: z.string().trim().min(1),
  sourceUrl: z.url(),
  storagePath: z.string().trim().optional(),
  cdnUrl: z.url().optional(),
  resolution: z.string().trim().optional(),
  bitrate: z.number().int().optional(),
  format: z.string().trim().optional(),
  sortOrder: z.number().int().optional(),
});

const rawVideoIngestSchema = z
  .object({
    sourceProvider: z.string().trim().min(1),
    sourceExternalId: z.string().trim().min(1),
    title: z.string().trim().min(1),
    slug: z.string().trim().optional(),
    subtitle: z.string().trim().optional(),
    description: z.string().trim().optional(),
    coverUrl: z.url().optional(),
    posterUrl: z.url().optional(),
    trailerUrl: z.url().optional(),
    type: z.string().trim().default("movie"),
    region: z.string().trim().optional(),
    language: z.string().trim().optional(),
    year: z.number().int().optional(),
    durationSeconds: z.number().int().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    publishedAt: z.string().datetime().optional(),
    sourcePayload: z.record(z.string(), z.unknown()).optional(),
    videoUrl: z.url().optional(),
    videoFormat: sourceFormatSchema.optional(),
    category: z.union([z.string().trim().min(1), categoryObjectSchema]).optional(),
    tags: z.array(z.union([z.string().trim().min(1), tagObjectSchema])).default([]),
    sources: z.array(sourceSchema).default([]),
    episodes: z
      .array(
        z.object({
          title: z.string().trim().min(1),
          episodeNo: z.number().int().optional(),
          sourceUrl: z.url().optional(),
          durationSeconds: z.number().int().optional(),
          isFree: z.boolean().optional(),
          sortOrder: z.number().int().optional(),
          publishedAt: z.string().datetime().optional(),
        }),
      )
      .default([]),
    subtitles: z
      .array(
        z.object({
          language: z.string().trim().min(1),
          fileUrl: z.url(),
          format: z.string().trim().optional(),
        }),
      )
      .default([]),
  })
  .superRefine((input, ctx) => {
    if (!input.videoUrl && input.sources.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["videoUrl"],
        message:
          "Provide videoUrl + videoFormat for the V1 contract, or send a sources array.",
      });
    }

    if (input.videoUrl && !input.videoFormat) {
      ctx.addIssue({
        code: "custom",
        path: ["videoFormat"],
        message: "videoFormat is required when videoUrl is provided.",
      });
    }
  });

export const videoIngestSchema = rawVideoIngestSchema.transform((input) => {
  const normalizedCategory =
    typeof input.category === "string"
      ? {
          name: input.category,
        }
      : input.category;

  const normalizedTags = input.tags.map((tag) =>
    typeof tag === "string"
      ? {
          name: tag,
        }
      : tag,
  );

  const primarySource =
    input.videoUrl && input.videoFormat
      ? [
          {
            sourceType: input.videoFormat === "m3u8" ? "hls" : "direct",
            sourceUrl: input.videoUrl,
            storagePath: undefined,
            cdnUrl: undefined,
            resolution: undefined,
            bitrate: undefined,
            format: input.videoFormat,
            sortOrder: 0,
          },
        ]
      : [];

  return {
    ...input,
    category: normalizedCategory,
    tags: normalizedTags,
    sources: input.sources.length > 0 ? input.sources : primarySource,
  };
});

export const batchVideoIngestSchema = z.object({
  items: z.array(videoIngestSchema).min(1),
});

export type VideoIngestInput = z.infer<typeof videoIngestSchema>;
export type BatchVideoIngestInput = z.infer<typeof batchVideoIngestSchema>;
