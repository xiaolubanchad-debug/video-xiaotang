import {
  IngestAction,
  IngestStatus,
  Prisma,
  VideoStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { type VideoIngestInput } from "@/lib/validations/video-ingest";

async function ensureCategory(input: VideoIngestInput["category"]) {
  if (!input?.name) {
    return null;
  }

  const slug = input.slug ?? slugify(input.name);

  const category = await prisma.category.upsert({
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

async function syncTags(videoId: string, input: VideoIngestInput["tags"]) {
  await prisma.videoTag.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  for (const tagInput of input) {
    const slug = tagInput.slug ?? slugify(tagInput.name);

    const tag = await prisma.tag.upsert({
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

    await prisma.videoTag.create({
      data: {
        videoId,
        tagId: tag.id,
      },
    });
  }
}

async function syncSources(videoId: string, input: VideoIngestInput["sources"]) {
  await prisma.videoSource.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  await prisma.videoSource.createMany({
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

async function syncEpisodes(videoId: string, input: VideoIngestInput["episodes"]) {
  await prisma.videoEpisode.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  await prisma.videoEpisode.createMany({
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
  videoId: string,
  input: VideoIngestInput["subtitles"],
) {
  await prisma.videoSubtitle.deleteMany({
    where: { videoId },
  });

  if (!input?.length) {
    return;
  }

  await prisma.videoSubtitle.createMany({
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

export async function upsertVideoFromIngest(input: VideoIngestInput) {
  try {
    const categoryId = await ensureCategory(input.category);
    const slug = input.slug ?? slugify(input.title);
    const ingestPayload = JSON.parse(JSON.stringify(input)) as Prisma.InputJsonValue;
    const sourcePayload = input.sourcePayload as
      | Prisma.InputJsonValue
      | undefined;
    const publishedAt =
      input.publishedAt != null
        ? new Date(input.publishedAt)
        : input.status === "PUBLISHED"
          ? new Date()
          : null;

    const video = await prisma.video.upsert({
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

    await syncTags(video.id, input.tags);
    await syncSources(video.id, input.sources);
    await syncEpisodes(video.id, input.episodes);
    await syncSubtitles(video.id, input.subtitles);

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
