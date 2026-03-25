import { Banner, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { AdminBannerInput } from "@/lib/validations/admin-banner";

function parseOptionalDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("时间格式不正确。");
  }

  return date;
}

async function normalizeBannerInput(input: AdminBannerInput) {
  const startAt = parseOptionalDate(input.startAt);
  const endAt = parseOptionalDate(input.endAt);

  if (startAt && endAt && startAt > endAt) {
    throw new Error("开始时间不能晚于结束时间。");
  }

  if (input.videoId) {
    const video = await prisma.video.findUnique({
      where: {
        id: input.videoId,
      },
      select: {
        id: true,
      },
    });

    if (!video) {
      throw new Error("关联视频不存在。");
    }
  }

  return {
    title: input.title,
    imageUrl: input.imageUrl,
    targetUrl: input.targetUrl ?? null,
    videoId: input.videoId ?? null,
    sortOrder: input.sortOrder,
    status: input.status,
    startAt,
    endAt,
  } satisfies Prisma.BannerUncheckedCreateInput;
}

async function writeAuditLog(params: {
  userId: string;
  action: string;
  targetId: string;
  detail: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      module: "banner",
      targetId: params.targetId,
      detail: params.detail,
    },
  });
}

export async function createBannerFromAdmin(
  input: AdminBannerInput,
  userId: string,
) {
  const data = await normalizeBannerInput(input);

  const banner = await prisma.banner.create({
    data,
  });

  await writeAuditLog({
    userId,
    action: "banner.create",
    targetId: banner.id,
    detail: {
      title: banner.title,
      status: banner.status,
      videoId: banner.videoId,
    },
  });

  return banner;
}

export async function updateBannerFromAdmin(
  bannerId: string,
  input: AdminBannerInput,
  userId: string,
) {
  const existingBanner = await prisma.banner.findUnique({
    where: {
      id: bannerId,
    },
  });

  if (!existingBanner) {
    throw new Error("Banner 不存在。");
  }

  const data = await normalizeBannerInput(input);

  const banner = await prisma.banner.update({
    where: {
      id: bannerId,
    },
    data,
  });

  await writeAuditLog({
    userId,
    action: "banner.update",
    targetId: banner.id,
    detail: {
      title: banner.title,
      status: banner.status,
      videoId: banner.videoId,
    },
  });

  return banner;
}

export async function deleteBannerFromAdmin(bannerId: string, userId: string) {
  const existingBanner = await prisma.banner.findUnique({
    where: {
      id: bannerId,
    },
  });

  if (!existingBanner) {
    throw new Error("Banner 不存在。");
  }

  await prisma.banner.delete({
    where: {
      id: bannerId,
    },
  });

  await writeAuditLog({
    userId,
    action: "banner.delete",
    targetId: bannerId,
    detail: {
      title: existingBanner.title,
      status: existingBanner.status,
    },
  });
}

export async function listBannerOptionsForAdmin() {
  const [banners, videos] = await Promise.all([
    prisma.banner.findMany({
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      include: {
        video: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      take: 40,
    }),
    prisma.video.findMany({
      orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
      take: 120,
    }),
  ]);

  return {
    banners,
    videos,
  };
}

export type AdminBannerRecord = Banner & {
  video: {
    id: string;
    title: string;
    slug: string;
  } | null;
};
