import { Prisma, VideoStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const adminVideoSelect = Prisma.validator<Prisma.VideoSelect>()({
  id: true,
  title: true,
  slug: true,
  status: true,
  sourceProvider: true,
  sourceExternalId: true,
  viewCount: true,
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
        },
      },
    },
  },
  sources: {
    select: {
      sourceUrl: true,
      format: true,
    },
    take: 1,
    orderBy: {
      sortOrder: "asc",
    },
  },
});

export type AdminVideoLibraryFilters = {
  q?: string;
  status?: string;
  provider?: string;
  category?: string;
  source?: string;
  externalId?: string;
};

export async function listAdminVideos(filters: AdminVideoLibraryFilters) {
  const q = filters.q?.trim() ?? "";
  const provider = filters.provider?.trim() ?? "";
  const category = filters.category?.trim() ?? "";
  const source = filters.source?.trim() ?? "";
  const externalId = filters.externalId?.trim() ?? "";
  const status =
    filters.status && filters.status in VideoStatus
      ? (filters.status as VideoStatus)
      : undefined;

  const where: Prisma.VideoWhereInput = {
    ...(q
      ? {
          title: {
            contains: q,
            mode: "insensitive",
          },
        }
      : {}),
    ...(status ? { status } : {}),
    ...(provider
      ? {
          sourceProvider: {
            contains: provider,
            mode: "insensitive",
          },
        }
      : {}),
    ...(externalId
      ? {
          sourceExternalId: {
            contains: externalId,
            mode: "insensitive",
          },
        }
      : {}),
    ...(category
      ? {
          category: {
            slug: category,
          },
        }
      : {}),
    ...(source === "with"
      ? {
          sources: {
            some: {},
          },
        }
      : source === "without"
        ? {
            sources: {
              none: {},
            },
          }
        : {}),
  };

  const [videos, categories, stats] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }],
      select: adminVideoSelect,
      take: 60,
    }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.$transaction([
      prisma.video.count(),
      prisma.video.count({
        where: {
          status: VideoStatus.DRAFT,
        },
      }),
      prisma.video.count({
        where: {
          status: VideoStatus.PUBLISHED,
        },
      }),
      prisma.video.count({
        where: {
          sources: {
            none: {},
          },
        },
      }),
    ]),
  ]);

  return {
    videos,
    categories,
    filters: {
      q,
      status: status ?? "",
      provider,
      category,
      source,
      externalId,
    },
    stats: {
      total: stats[0],
      draft: stats[1],
      published: stats[2],
      withoutSource: stats[3],
    },
  };
}
