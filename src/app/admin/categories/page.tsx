import { AdminCategoriesManager } from "@/components/admin/admin-categories-manager";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await requireSuperAdminPageSession();

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sortOrder: true,
      status: true,
      updatedAt: true,
      _count: {
        select: {
          videos: true,
        },
      },
    },
    take: 100,
  });

  return (
    <AdminShell
      section="categories"
      userEmail={session.user.email}
      eyebrow="内容结构"
      title="分类管理"
      description="分类决定前台导航和频道结构，也会影响首页专题行的组织方式。尽量保持名称稳定、数量克制。"
    >
      <AdminCategoriesManager
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder,
          status: category.status,
          videoCount: category._count.videos,
          updatedAtLabel: category.updatedAt.toLocaleString("zh-CN"),
        }))}
      />
    </AdminShell>
  );
}
