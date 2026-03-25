import {
  IngestAction,
  IngestStatus,
  Prisma,
  VideoStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { type VideoIngestInput } from "@/lib/validations/video-ingest";

async function ensureCategory(
  tx: Prisma.TransactionClient,
  input: VideoIngestInput["category"],
) {
  if (!input?.name) {
    return null;
  }

  const slug = input.slug ?? slugify(input.name);

  const category = await tx.category.upsert({
    where: { slug },
    create: {
      name: input.name,
      slug,
      description: input.description,
    },
    update: {
      name: input.name,
      description: input.description,
    },
  });

  return category.id;
}

async function syncTags(
  tx: Prisma.TransactionClient,
  videoId: string,
  input: VideoIngestInput["tags"],
) {
  await tx.videoTag.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  for (const tagInput of input) {
    const slug = tagInput.slug ?? slugify(tagInput.name);

    const tag = await tx.tag.upsert({
      where: { slug },
      create: {
        name: tagInput.name,
        slug,
        color: tagInput.color,
      },
      update: {
        name: tagInput.name,
        color: tagInput.color,
      },
    });

    await tx.videoTag.create({
      data: {
        videoId,
        tagId: tag.id,
      },
    });
  }
}

async function syncSources(
  tx: Prisma.TransactionClient,
  videoId: string,
  input: VideoIngestInput["sources"],
) {
  await tx.videoSource.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  await tx.videoSource.createMany({
    data: input.map((item, index) => ({
      videoId,
      sourceType: item.sourceType,
      sourceUrl: item.sourceUrl,
      storagePath: item.storagePath,
      cdnUrl: item.cdnUrl,
      resolution: item.resolution,
      bitrate: item.bitrate,
      format: item.format,
      sortOrder: item.sortOrder ?? index,
    })),
  });
}

async function syncEpisodes(
  tx: Prisma.TransactionClient,
  videoId: string,
  input: VideoIngestInput["episodes"],
) {
  await tx.videoEpisode.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  await tx.videoEpisode.createMany({
    data: input.map((item, index) => ({
      videoId,
      title: item.title,
      episodeNo: item.episodeNo ?? index + 1,
      sourceUrl: item.sourceUrl,
      durationSeconds: item.durationSeconds,
      isFree: item.isFree ?? true,
      sortOrder: item.sortOrder ?? index,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
    })),
  });
}

async function syncSubtitles(
  tx: Prisma.TransactionClient,
  videoId: string,
  input: VideoIngestInput["subtitles"],
) {
  await tx.videoSubtitle.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  await tx.videoSubtitle.createMany({
    data: input.map((item) => ({
      videoId,
      language: item.language,
      fileUrl: item.fileUrl,
      format: item.format,
    })),
  });
}

async function createIngestLog(
  provider: string,
  action: IngestAction,
  externalId: string,
  requestPayload: Prisma.InputJsonValue,
  status: IngestStatus,
  errorMessage?: string,
) {
  await prisma.ingestLog.create({
    data: {
      provider,
      action,
      externalId,
      requestPayload,
      responseStatus: status,
      errorMessage,
    },
  });
}

async function buildUniqueSlug(
  tx: Prisma.TransactionClient,
  desiredSlug: string,
  sourceProvider: string,
  sourceExternalId: string,
) {
  const existingBySource = await tx.video.findUnique({
    where: {
      sourceProvider_sourceExternalId: {
        sourceProvider,
        sourceExternalId,
      },
    },
    select: {
      id: true,
    },
  });

  const baseSlug = slugify(desiredSlug);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await tx.video.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === existingBySource?.id) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function upsertVideoFromIngest(input: VideoIngestInput) {
  try {
    const ingestPayload = JSON.parse(JSON.stringify(input)) as Prisma.InputJsonValue;
    const sourcePayload = input.sourcePayload as
      | Prisma.InputJsonValue
      | undefined;

    const video = await prisma.$transaction(async (tx) => {
      const categoryId = await ensureCategory(tx, input.category);
      const slug = await buildUniqueSlug(
        tx,
        input.slug ?? input.title,
        input.sourceProvider,
        input.sourceExternalId,
      );
      const publishedAt =
        input.publishedAt != null
          ? new Date(input.publishedAt)
          : input.status === "PUBLISHED"
            ? new Date()
            : null;

      const upsertedVideo = await tx.video.upsert({
        where: {
          sourceProvider_sourceExternalId: {
            sourceProvider: input.sourceProvider,
            sourceExternalId: input.sourceExternalId,
          },
        },
        create: {
          title: input.title,
          slug,
          subtitle: input.subtitle,
          description: input.description,
          coverUrl: input.coverUrl,
          posterUrl: input.posterUrl,
          trailerUrl: input.trailerUrl,
          type: input.type ?? "movie",
          region: input.region,
          language: input.language,
          year: input.year,
          durationSeconds: input.durationSeconds,
          status: input.status ?? VideoStatus.PUBLISHED,
          publishedAt,
          sourceProvider: input.sourceProvider,
          sourceExternalId: input.sourceExternalId,
          sourcePayload,
          categoryId,
        },
        update: {
          title: input.title,
          slug,
          subtitle: input.subtitle,
          description: input.description,
          coverUrl: input.coverUrl,
          posterUrl: input.posterUrl,
          trailerUrl: input.trailerUrl,
          type: input.type ?? "movie",
          region: input.region,
          language: input.language,
          year: input.year,
          durationSeconds: input.durationSeconds,
          status: input.status ?? VideoStatus.PUBLISHED,
          publishedAt,
          sourcePayload,
          categoryId,
        },
      });

      await syncTags(tx, upsertedVideo.id, input.tags);
      await syncSources(tx, upsertedVideo.id, input.sources);
      await syncEpisodes(tx, upsertedVideo.id, input.episodes);
      await syncSubtitles(tx, upsertedVideo.id, input.subtitles);

      return upsertedVideo;
    });

    await createIngestLog(
      input.sourceProvider,
      IngestAction.UPSERT,
      input.sourceExternalId,
      ingestPayload,
      IngestStatus.SUCCESS,
    );

    return video;
  } catch (error) {
    await createIngestLog(
      input.sourceProvider,
      IngestAction.UPSERT,
      input.sourceExternalId,
      JSON.parse(JSON.stringify(input)) as Prisma.InputJsonValue,
      IngestStatus.FAILED,
      error instanceof Error ? error.message : "Unknown ingest error",
    );

    throw error;
  }
}

export async function deleteVideoFromIngest(
  sourceProvider: string,
  sourceExternalId: string,
) {
  const existing = await prisma.video.findUnique({
    where: {
      sourceProvider_sourceExternalId: {
        sourceProvider,
        sourceExternalId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    await createIngestLog(
      sourceProvider,
      IngestAction.DELETE,
      sourceExternalId,
      { sourceProvider, sourceExternalId },
      IngestStatus.SUCCESS,
    );

    return false;
  }

  await prisma.video.delete({
    where: {
      id: existing.id,
    },
  });

  await createIngestLog(
    sourceProvider,
    IngestAction.DELETE,
    sourceExternalId,
    { sourceProvider, sourceExternalId },
    IngestStatus.SUCCESS,
  );

  return true;
}
