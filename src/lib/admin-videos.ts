import { VideoStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { type AdminVideoInput } from "@/lib/validations/admin-video";

async function ensureCategoryByName(name?: string) {
  if (!name) {
    return null;
  }

  const slug = slugify(name);

  const category = await prisma.category.upsert({
    where: { slug },
    create: {
      name,
      slug,
    },
    update: {
      name,
    },
  });

  return category.id;
}

async function syncManualTags(videoId: string, tags: string[]) {
  await prisma.videoTag.deleteMany({
    where: { videoId },
  });

  for (const tagName of tags) {
    const slug = slugify(tagName);

    const tag = await prisma.tag.upsert({
      where: { slug },
      create: {
        name: tagName,
        slug,
      },
      update: {
        name: tagName,
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

async function syncPrimarySource(videoId: string, sourceUrl?: string) {
  await prisma.videoSource.deleteMany({
    where: { videoId },
  });

  if (!sourceUrl) {
    return;
  }

  await prisma.videoSource.create({
    data: {
      videoId,
      sourceType: "manual-link",
      sourceUrl,
      sortOrder: 0,
    },
  });
}

async function buildUniqueSlug(title: string, currentVideoId?: string) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.video.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === currentVideoId) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function createVideoFromAdmin(input: AdminVideoInput, userId: string) {
  const categoryId = await ensureCategoryByName(input.categoryName);
  const slug = await buildUniqueSlug(input.title);

  const video = await prisma.video.create({
    data: {
      title: input.title,
      slug,
      subtitle: input.subtitle || null,
      description: input.description || null,
      coverUrl: input.coverUrl || null,
      posterUrl: input.posterUrl || null,
      trailerUrl: input.trailerUrl || null,
      type: input.type,
      region: input.region || null,
      language: input.language || null,
      year: input.year,
      durationSeconds: input.durationSeconds,
      status: input.status as VideoStatus,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      sourceProvider: "manual-admin",
      sourceExternalId: crypto.randomUUID(),
      createdBy: userId,
      categoryId,
    },
  });

  await syncManualTags(video.id, input.tags);
  await syncPrimarySource(video.id, input.sourceUrl || undefined);

  await prisma.auditLog.create({
    data: {
      userId,
      action: "CREATE",
      module: "video",
      targetId: video.id,
      detail: {
        title: video.title,
        sourceProvider: video.sourceProvider,
      },
    },
  });

  return video;
}

export async function getVideoForAdmin(videoId: string) {
  return prisma.video.findUnique({
    where: { id: videoId },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      sources: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });
}

export async function updateVideoFromAdmin(
  videoId: string,
  input: AdminVideoInput,
  userId: string,
) {
  const existing = await prisma.video.findUnique({
    where: { id: videoId },
    select: {
      id: true,
      title: true,
    },
  });

  if (!existing) {
    throw new Error("Video not found.");
  }

  const categoryId = await ensureCategoryByName(input.categoryName);
  const slug = await buildUniqueSlug(input.title, videoId);

  const video = await prisma.video.update({
    where: { id: videoId },
    data: {
      title: input.title,
      slug,
      subtitle: input.subtitle || null,
      description: input.description || null,
      coverUrl: input.coverUrl || null,
      posterUrl: input.posterUrl || null,
      trailerUrl: input.trailerUrl || null,
      type: input.type,
      region: input.region || null,
      language: input.language || null,
      year: input.year,
      durationSeconds: input.durationSeconds,
      status: input.status as VideoStatus,
      publishedAt:
        input.status === "PUBLISHED"
          ? existing.title === input.title
            ? undefined
            : new Date()
          : input.status === "ARCHIVED"
            ? null
            : undefined,
      categoryId,
    },
  });

  await syncManualTags(video.id, input.tags);
  await syncPrimarySource(video.id, input.sourceUrl || undefined);

  await prisma.auditLog.create({
    data: {
      userId,
      action: "UPDATE",
      module: "video",
      targetId: video.id,
      detail: {
        title: video.title,
      },
    },
  });

  return video;
}

export async function deleteVideoFromAdmin(videoId: string, userId: string) {
  const existing = await prisma.video.findUnique({
    where: { id: videoId },
    select: {
      id: true,
      title: true,
    },
  });

  if (!existing) {
    throw new Error("Video not found.");
  }

  await prisma.video.delete({
    where: { id: videoId },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "DELETE",
      module: "video",
      targetId: videoId,
      detail: {
        title: existing.title,
      },
    },
  });

  return existing;
}
