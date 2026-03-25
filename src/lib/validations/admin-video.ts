import { z } from "zod";

export const adminVideoSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  posterUrl: z.string().url().optional().or(z.literal("")),
  trailerUrl: z.string().url().optional().or(z.literal("")),
  type: z.string().trim().min(1).default("movie"),
  region: z.string().trim().optional(),
  language: z.string().trim().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  durationSeconds: z.number().int().positive().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryName: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  sourceUrl: z.string().url().optional().or(z.literal("")),
});

export const adminVideoStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type AdminVideoInput = z.infer<typeof adminVideoSchema>;
export type AdminVideoStatusInput = z.infer<typeof adminVideoStatusSchema>;
