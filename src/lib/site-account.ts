import { CommentStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const favoriteVideoSelect = Prisma.validator<Prisma.VideoSelect>()({
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  description: true,
  coverUrl: true,
  posterUrl: true,
  type: true,
  year: true,
  region: true,
  language: true,
  durationSeconds: true,
  publishedAt: true,
  updatedAt: true,
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  tags: {
    include: {
      tag: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    take: 3,
  },
  sources: {
    select: {
      sourceUrl: true,
      format: true,
      sourceType: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    take: 1,
  },
});

export async function getViewerCenterSummary(userId: string) {
  const [favoriteCount, commentCount, pendingCommentCount] = await prisma.$transaction([
    prisma.favorite.count({
      where: { userId },
    }),
    prisma.comment.count({
      where: { userId },
    }),
    prisma.comment.count({
      where: {
        userId,
        status: CommentStatus.PENDING,
      },
    }),
  ]);

  return {
    favoriteCount,
    commentCount,
    pendingCommentCount,
  };
}

export async function listViewerFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      video: {
        select: favoriteVideoSelect,
      },
    },
    take: 50,
  });
}

export async function listViewerComments(userId: string) {
  return prisma.comment.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      content: true,
      status: true,
      likeCount: true,
      createdAt: true,
      video: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    take: 80,
  });
}

export async function isVideoFavoritedByViewer(userId: string, videoId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(favorite);
}

async function syncFavoriteCount(videoId: string) {
  const count = await prisma.favorite.count({
    where: {
      videoId,
    },
  });

  await prisma.video.update({
    where: {
      id: videoId,
    },
    data: {
      favoriteCount: count,
    },
  });
}

export async function addFavoriteForViewer(userId: string, videoId: string) {
  await prisma.favorite.upsert({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
    create: {
      userId,
      videoId,
    },
    update: {},
  });

  await syncFavoriteCount(videoId);
}

export async function removeFavoriteForViewer(userId: string, videoId: string) {
  await prisma.favorite.deleteMany({
    where: {
      userId,
      videoId,
    },
  });

  await syncFavoriteCount(videoId);
}

export async function deletePendingCommentForViewer(userId: string, commentId: string) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!comment) {
    throw new Error("Comment not found.");
  }

  if (comment.status !== CommentStatus.PENDING) {
    throw new Error("Only pending comments can be deleted.");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}
