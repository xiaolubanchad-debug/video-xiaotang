import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTagsManager } from "@/components/admin/admin-tags-manager";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const session = await requireSuperAdminPageSession();

  const tags = await prisma.tag.findMany({
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      updatedAt: true,
      _count: {
        select: {
          videos: true,
        },
      },
    },
    take: 120,
  });

  return (
    <AdminShell
      section="tags"
      userEmail={session.user.email}
      eyebrow="内容发现"
      title="标签管理"
      description="标签会参与第一版标题加标签搜索，也会用于相关推荐和首页的内容表达。保持可复用、少重复。"
    >
      <AdminTagsManager
        tags={tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          color: tag.color,
          videoCount: tag._count.videos,
          updatedAtLabel: tag.updatedAt.toLocaleString("zh-CN"),
        }))}
      />
    </AdminShell>
  );
}
