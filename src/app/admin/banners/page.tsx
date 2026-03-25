import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBannersManager } from "@/components/admin/admin-banners-manager";
import { listBannerOptionsForAdmin } from "@/lib/admin-banners";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function formatDateTimeInput(date: Date | null) {
  if (!date) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export default async function AdminBannersPage() {
  const session = await requireSuperAdminPageSession();
  const { banners, videos } = await listBannerOptionsForAdmin();

  return (
    <AdminShell
      section="banners"
      userEmail={session.user.email}
      eyebrow="首页编排"
      title="Banner 管理"
      description="优先维护首页主视觉推荐位。支持关联站内视频、额外跳转地址、排序与生效时间窗口。"
    >
      <AdminBannersManager
        banners={banners.map((banner) => ({
          id: banner.id,
          title: banner.title,
          imageUrl: banner.imageUrl,
          targetUrl: banner.targetUrl,
          videoId: banner.videoId,
          videoTitle: banner.video?.title ?? null,
          sortOrder: banner.sortOrder,
          status: banner.status,
          startAt: formatDateTimeInput(banner.startAt),
          endAt: formatDateTimeInput(banner.endAt),
          updatedAtLabel: banner.updatedAt.toLocaleString("zh-CN"),
        }))}
        videoOptions={videos}
      />
    </AdminShell>
  );
}
