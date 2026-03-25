import { Prisma, VideoStatus } from "@prisma/client";

import {
  getManualHomeSectionDefinition,
  manualHomeSectionDefinitions,
  ManualHomeSectionKey,
} from "@/lib/home-sections";
import { prisma } from "@/lib/prisma";
import { AdminHomeSectionsInput } from "@/lib/validations/admin-home-sections";

const HOME_COLLECTION_STATUS = "ACTIVE";
const HOME_COLLECTION_TYPE = "home-section";

async function ensureHomeCollections(
  tx: Prisma.TransactionClient | typeof prisma,
) {
  await Promise.all(
    manualHomeSectionDefinitions.map((section, index) =>
      tx.collection.upsert({
        where: {
          slug: section.slug,
        },
        update: {
          title: section.title,
          description: section.description,
          type: HOME_COLLECTION_TYPE,
          status: HOME_COLLECTION_STATUS,
          sortOrder: index,
        },
        create: {
          title: section.title,
          slug: section.slug,
          description: section.description,
          type: HOME_COLLECTION_TYPE,
          status: HOME_COLLECTION_STATUS,
          sortOrder: index,
        },
      }),
    ),
  );
}

export async function listHomeSectionsForAdmin() {
  await ensureHomeCollections(prisma);

  const [collections, videos] = await Promise.all([
    prisma.collection.findMany({
      where: {
        slug: {
          in: manualHomeSectionDefinitions.map((item) => item.slug),
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        items: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            video: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                coverUrl: true,
                posterUrl: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    }),
    prisma.video.findMany({
      where: {
        status: VideoStatus.PUBLISHED,
      },
      orderBy: [{ updatedAt: "desc" }, { publishedAt: "desc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
      take: 160,
    }),
  ]);

  return {
    collections,
    videos,
  };
}

export async function updateHomeSectionsFromAdmin(
  input: AdminHomeSectionsInput,
  userId: string,
) {
  const allVideoIds = [...input.hotVideoIds, ...input.editorVideoIds];

  const videos = await prisma.video.findMany({
    where: {
      id: {
        in: allVideoIds,
      },
      status: VideoStatus.PUBLISHED,
    },
    select: {
      id: true,
    },
  });

  if (videos.length !== allVideoIds.length) {
    throw new Error("所选视频里包含不存在或未发布的内容。");
  }

  await prisma.$transaction(async (tx) => {
    await ensureHomeCollections(tx);

    const collections = await tx.collection.findMany({
      where: {
        slug: {
          in: manualHomeSectionDefinitions.map((item) => item.slug),
        },
      },
      select: {
        id: true,
        slug: true,
      },
    });

    const collectionMap = new Map(collections.map((item) => [item.slug, item.id]));

    const sectionUpdates: Array<{
      key: ManualHomeSectionKey;
      videoIds: string[];
    }> = [
      { key: "hot", videoIds: input.hotVideoIds },
      { key: "editor", videoIds: input.editorVideoIds },
    ];

    for (const section of sectionUpdates) {
      const definition = getManualHomeSectionDefinition(section.key);
      const collectionId = collectionMap.get(definition.slug);

      if (!collectionId) {
        throw new Error("首页片单初始化失败。");
      }

      await tx.collectionItem.deleteMany({
        where: {
          collectionId,
        },
      });

      if (section.videoIds.length > 0) {
        await tx.collectionItem.createMany({
          data: section.videoIds.map((videoId, index) => ({
            collectionId,
            videoId,
            sortOrder: index,
          })),
        });
      }
    }

    await tx.auditLog.create({
      data: {
        userId,
        action: "home-sections.update",
        module: "home-sections",
        detail: {
          hotVideoIds: input.hotVideoIds,
          editorVideoIds: input.editorVideoIds,
        },
      },
    });
  });
}
