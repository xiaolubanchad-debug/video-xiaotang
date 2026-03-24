import { z } from "zod";

export const videoIngestSchema = z.object({
  sourceProvider: z.string().min(1),
  sourceExternalId: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.url().optional(),
  posterUrl: z.url().optional(),
  trailerUrl: z.url().optional(),
  type: z.string().default("movie"),
  region: z.string().optional(),
  language: z.string().optional(),
  year: z.number().int().optional(),
  durationSeconds: z.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().optional(),
  sourcePayload: z.record(z.string(), z.unknown()).optional(),
  category: z
    .object({
      name: z.string().min(1),
      slug: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  tags: z
    .array(
      z.object({
        name: z.string().min(1),
        slug: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .default([]),
  sources: z
    .array(
      z.object({
        sourceType: z.string().min(1),
        sourceUrl: z.url(),
        storagePath: z.string().optional(),
        cdnUrl: z.url().optional(),
        resolution: z.string().optional(),
        bitrate: z.number().int().optional(),
        format: z.string().optional(),
        sortOrder: z.number().int().optional(),
      }),
    )
    .default([]),
  episodes: z
    .array(
      z.object({
        title: z.string().min(1),
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
        language: z.string().min(1),
        fileUrl: z.url(),
        format: z.string().optional(),
      }),
    )
    .default([]),
});

export const batchVideoIngestSchema = z.object({
  items: z.array(videoIngestSchema).min(1),
});

export type VideoIngestInput = z.infer<typeof videoIngestSchema>;
export type BatchVideoIngestInput = z.infer<typeof batchVideoIngestSchema>;
