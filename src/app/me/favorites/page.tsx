import { MeNav } from "@/components/site/me-nav";
import { SiteShell } from "@/components/site/site-shell";
import { VideoCard } from "@/components/site/video-card";
import { requireViewerPageSession } from "@/lib/auth";
import { getViewerCenterSummary, listViewerFavorites } from "@/lib/site-account";
import { getSiteNavigationCategories } from "@/lib/site-videos";

export default async function MyFavoritesPage() {
  const session = await requireViewerPageSession();
  const [categories, summary, favorites] = await Promise.all([
    getSiteNavigationCategories(),
    getViewerCenterSummary(session.user.id),
    listViewerFavorites(session.user.id),
  ]);

  return (
    <SiteShell categories={categories} activeNav="discover" viewer={session.user}>
      <div className="space-y-8">
        <section className="space-y-6 rounded-[30px] border border-white/6 bg-[#151515] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:px-8">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl text-white sm:text-6xl">我的收藏</h1>
            <p className="max-w-3xl text-base leading-8 text-[#b6b4bc]">
              当前共收藏了 {summary.favoriteCount} 部视频。你可以在详情页继续收藏或取消收藏，这里会同步更新。
            </p>
          </div>

          <MeNav activeHref="/me/favorites" />
        </section>

        {favorites.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm leading-7 text-slate-300">
            你还没有收藏任何内容。去视频详情页点一下“加入收藏”，这里就会开始积累你的片单。
          </section>
        ) : (
          <section className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {favorites.map((item) => (
              <VideoCard key={item.id} video={item.video} />
            ))}
          </section>
        )}
      </div>
    </SiteShell>
  );
}
