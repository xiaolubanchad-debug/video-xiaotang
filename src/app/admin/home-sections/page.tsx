import { AdminHomeSectionsManager } from "@/components/admin/admin-home-sections-manager";
import { AdminShell } from "@/components/admin/admin-shell";
import { listHomeSectionsForAdmin } from "@/lib/admin-home-sections";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { getManualHomeSectionDefinition } from "@/lib/home-sections";

export const dynamic = "force-dynamic";

export default async function AdminHomeSectionsPage() {
  const session = await requireSuperAdminPageSession();
  const { collections, videos } = await listHomeSectionsForAdmin();

  return (
    <AdminShell
      section="homeSections"
      userEmail={session.user.email}
      eyebrow="首页编排"
      title="首页内容区块"
      description="首页固定展示 4 个区块：热门推荐、最新更新、站长精选、猜你喜欢。这里维护其中两个手工编排区块。"
    >
      <AdminHomeSectionsManager
        sections={collections.map((collection) => {
          const definition = getManualHomeSectionDefinition(
            collection.slug === "home-hot-recommend" ? "hot" : "editor",
          );

          return {
            key: definition.key,
            title: definition.title,
            description: definition.description,
            items: collection.items.map((item) => ({
              id: item.video.id,
              title: item.video.title,
              slug: item.video.slug,
              updatedAtLabel: item.video.updatedAt.toLocaleString("zh-CN"),
            })),
          };
        })}
        videos={videos}
      />
    </AdminShell>
  );
}
