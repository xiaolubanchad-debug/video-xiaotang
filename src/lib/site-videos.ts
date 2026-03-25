import { BannerStatus, Prisma, VideoStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const cardVideoSelect = Prisma.validator<Prisma.VideoSelect>()({
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

const heroBannerSelect = Prisma.validator<Prisma.BannerSelect>()({
  id: true,
  title: true,
  imageUrl: true,
  targetUrl: true,
  sortOrder: true,
  video: {
    select: cardVideoSelect,
  },
});

export type SiteVideoCard = Prisma.VideoGetPayload<{
  select: typeof cardVideoSelect;
}>;

export type SiteHeroBanner = Prisma.BannerGetPayload<{
  select: typeof heroBannerSelect;
}>;

export async function getSiteNavigationCategories() {
  return prisma.category.findMany({
    where: {
      videos: {
        some: {
          status: VideoStatus.PUBLISHED,
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
    },
    take: 6,
  });
}

export async function getHomePageData() {
  const now = new Date();

  const [heroBanners, heroVideos, latestVideos, spotlightVideos, categoryRows] =
    await Promise.all([
      prisma.banner.findMany({
        where: {
          status: BannerStatus.ACTIVE,
          OR: [{ startAt: null }, { startAt: { lte: now } }],
          AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        select: heroBannerSelect,
        take: 3,
      }),
      prisma.video.findMany({
        where: {
          status: VideoStatus.PUBLISHED,
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: cardVideoSelect,
        take: 4,
      }),
      prisma.video.findMany({
        where: {
          status: VideoStatus.PUBLISHED,
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: cardVideoSelect,
        take: 8,
      }),
      prisma.video.findMany({
        where: {
          status: VideoStatus.PUBLISHED,
        },
        orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }],
        select: cardVideoSelect,
        take: 8,
      }),
      prisma.category.findMany({
        where: {
          videos: {
            some: {
              status: VideoStatus.PUBLISHED,
            },
          },
        },
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          videos: {
            where: {
              status: VideoStatus.PUBLISHED,
            },
            orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
            select: cardVideoSelect,
            take: 6,
          },
        },
        take: 3,
      }),
    ]);

  return {
    heroBanners,
    heroVideos,
    latestVideos,
    spotlightVideos,
    categoryRows: categoryRows.filter((row) => row.videos.length > 0),
  };
}

export async function getCategoryPageData(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      videos: {
        where: {
          status: VideoStatus.PUBLISHED,
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: cardVideoSelect,
        take: 24,
      },
    },
  });
}

export async function searchSiteVideos(query: string) {
  const keyword = query.trim();

  if (!keyword) {
    return [];
  }

  return prisma.video.findMany({
    where: {
      status: VideoStatus.PUBLISHED,
      OR: [
        {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: cardVideoSelect,
    take: 24,
  });
}

export async function getVideoDetailPageData(slug: string) {
  const video = await prisma.video.findFirst({
    where: {
      slug,
      status: VideoStatus.PUBLISHED,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      subtitle: true,
      description: true,
      coverUrl: true,
      posterUrl: true,
      trailerUrl: true,
      type: true,
      year: true,
      region: true,
      language: true,
      durationSeconds: true,
      publishedAt: true,
      category: {
        select: {
          id: true,
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
      },
      sources: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          sourceUrl: true,
          sourceType: true,
          format: true,
          resolution: true,
        },
      },
      episodes: {
        orderBy: [{ episodeNo: "asc" }, { sortOrder: "asc" }],
        select: {
          id: true,
          title: true,
          episodeNo: true,
          sourceUrl: true,
          durationSeconds: true,
          isFree: true,
          publishedAt: true,
        },
      },
    },
  });

  if (!video) {
    return null;
  }

  const relatedVideos = await prisma.video.findMany({
    where: {
      status: VideoStatus.PUBLISHED,
      id: {
        not: video.id,
      },
      ...(video.category?.id
        ? {
            categoryId: video.category.id,
          }
        : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: cardVideoSelect,
    take: 6,
  });

  return {
    video,
    relatedVideos,
  };
}
