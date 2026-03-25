import { CommentStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const adminUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  nickname: true,
  createdAt: true,
  _count: {
    select: {
      comments: true,
      favorites: true,
      watchHistories: true,
      searches: true,
    },
  },
});

export type AdminUserFilters = {
  email?: string;
};

export async function listUsersForAdmin(filters: AdminUserFilters) {
  const email = filters.email?.trim() ?? "";

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: {
        isSuperAdmin: false,
        ...(email
          ? {
              email: {
                contains: email,
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }],
      select: adminUserSelect,
      take: 100,
    }),
    prisma.user.count({
      where: {
        isSuperAdmin: false,
      },
    }),
  ]);

  return {
    users,
    filters: {
      email,
    },
    stats: {
      totalUsers,
      filteredUsers: users.length,
    },
  };
}

export async function deleteUserFromAdmin(userId: string, adminUserId: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        isSuperAdmin: true,
        _count: {
          select: {
            comments: true,
            favorites: true,
            watchHistories: true,
            searches: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.isSuperAdmin) {
      throw new Error("Super admin cannot be deleted.");
    }

    const [commentVideoRows, favoriteVideoRows] = await Promise.all([
      tx.comment.findMany({
        where: {
          userId,
        },
        select: {
          videoId: true,
        },
        distinct: ["videoId"],
      }),
      tx.favorite.findMany({
        where: {
          userId,
        },
        select: {
          videoId: true,
        },
        distinct: ["videoId"],
      }),
    ]);

    const affectedVideoIds = [
      ...new Set([
        ...commentVideoRows.map((item) => item.videoId),
        ...favoriteVideoRows.map((item) => item.videoId),
      ]),
    ];

    await tx.search.deleteMany({
      where: {
        userId,
      },
    });

    await tx.user.delete({
      where: {
        id: userId,
      },
    });

    for (const videoId of affectedVideoIds) {
      const [favoriteCount, commentCount] = await Promise.all([
        tx.favorite.count({
          where: {
            videoId,
          },
        }),
        tx.comment.count({
          where: {
            videoId,
            status: CommentStatus.APPROVED,
          },
        }),
      ]);

      await tx.video.update({
        where: {
          id: videoId,
        },
        data: {
          favoriteCount,
          commentCount,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        userId: adminUserId,
        action: "DELETE",
        module: "user",
        targetId: userId,
        detail: {
          email: user.email,
          commentsDeleted: user._count.comments,
          favoritesDeleted: user._count.favorites,
          watchHistoryDeleted: user._count.watchHistories,
          searchesDeleted: user._count.searches,
          affectedVideoIds,
        },
      },
    });

    return {
      email: user.email,
      affectedVideoIds,
    };
  });
}
