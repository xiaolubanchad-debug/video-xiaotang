import { BannerStatus, Prisma, VideoStatus } from "@prisma/client";

import { HOME_SECTION_MAX_ITEMS } from "@/lib/home-sections";
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

  const [heroBanners, heroVideos, manualCollections] = await Promise.all([
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
      take: HOME_SECTION_MAX_ITEMS,
    }),
    prisma.collection.findMany({
      where: {
        slug: {
          in: ["home-hot-recommend", "home-editor-picks"],
        },
      },
      select: {
        slug: true,
        items: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            video: {
              select: cardVideoSelect,
            },
          },
          take: HOME_SECTION_MAX_ITEMS,
        },
      },
    }),
  ]);

  const hotCollection = manualCollections.find(
    (collection) => collection.slug === "home-hot-recommend",
  );
  const editorCollection = manualCollections.find(
    (collection) => collection.slug === "home-editor-picks",
  );

  const hotPicks = await fillSectionVideos(
    hotCollection?.items.map((item) => item.video) ?? [],
    new Set<string>(),
  );
  const usedIdsAfterHot = new Set(hotPicks.map((video) => video.id));

  const latestUpdates = await prisma.video.findMany({
    where: {
      status: VideoStatus.PUBLISHED,
      id: {
        notIn: [...usedIdsAfterHot],
      },
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: cardVideoSelect,
    take: HOME_SECTION_MAX_ITEMS,
  });

  const usedIdsAfterLatest = new Set([
    ...usedIdsAfterHot,
    ...latestUpdates.map((video) => video.id),
  ]);

  const editorPicks = await fillSectionVideos(
    editorCollection?.items.map((item) => item.video) ?? [],
    usedIdsAfterLatest,
  );

  const usedIdsAfterEditor = new Set([
    ...usedIdsAfterLatest,
    ...editorPicks.map((video) => video.id),
  ]);

  const guessYouLike = await getRandomSectionVideos(usedIdsAfterEditor);

  return {
    heroBanners,
    heroVideos,
    sections: {
      hotPicks,
      latestUpdates,
      editorPicks,
      guessYouLike,
    },
  };
}

async function fillSectionVideos(
  preferredVideos: SiteVideoCard[],
  blockedIds: Set<string>,
) {
  const picked: SiteVideoCard[] = [];
  const seenIds = new Set(blockedIds);

  for (const video of preferredVideos) {
    if (seenIds.has(video.id)) {
      continue;
    }

    picked.push(video);
    seenIds.add(video.id);

    if (picked.length === HOME_SECTION_MAX_ITEMS) {
      return picked;
    }
  }

  if (picked.length < HOME_SECTION_MAX_ITEMS) {
    const fallbackVideos = await prisma.video.findMany({
      where: {
        status: VideoStatus.PUBLISHED,
        id: {
          notIn: [...seenIds],
        },
      },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      select: cardVideoSelect,
      take: HOME_SECTION_MAX_ITEMS - picked.length,
    });

    picked.push(...fallbackVideos);
  }

  return picked;
}

async function getRandomSectionVideos(blockedIds: Set<string>) {
  const candidateIds = await prisma.video.findMany({
    where: {
      status: VideoStatus.PUBLISHED,
      id: {
        notIn: [...blockedIds],
      },
    },
    select: {
      id: true,
    },
    take: 200,
  });

  const selectedIds = shuffle(candidateIds.map((video) => video.id)).slice(
    0,
    HOME_SECTION_MAX_ITEMS,
  );

  if (selectedIds.length === 0) {
    return [];
  }

  const selectedVideos = await prisma.video.findMany({
    where: {
      id: {
        in: selectedIds,
      },
    },
    select: cardVideoSelect,
  });

  const selectedVideoMap = new Map(
    selectedVideos.map((video) => [video.id, video] as const),
  );

  const orderedVideos = selectedIds
    .map((id) => selectedVideoMap.get(id))
    .filter(Boolean) as SiteVideoCard[];

  if (orderedVideos.length === HOME_SECTION_MAX_ITEMS) {
    return orderedVideos;
  }

  const alreadyPickedIds = new Set(orderedVideos.map((video) => video.id));
  const fallbackVideos = await prisma.video.findMany({
    where: {
      status: VideoStatus.PUBLISHED,
      id: {
        notIn: [...alreadyPickedIds],
      },
    },
    orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }],
    select: cardVideoSelect,
    take: HOME_SECTION_MAX_ITEMS - orderedVideos.length,
  });

  return [...orderedVideos, ...fallbackVideos].slice(0, HOME_SECTION_MAX_ITEMS);
}

function shuffle<T>(items: T[]) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
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
