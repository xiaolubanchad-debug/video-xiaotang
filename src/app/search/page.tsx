import { SiteShell } from "@/components/site/site-shell";
import { getViewerSession } from "@/lib/auth";
import { VideoCard } from "@/components/site/video-card";
import { formatVideoTypeLabel } from "@/lib/site-format";
import {
  getSiteNavigationCategories,
  searchSiteVideos,
} from "@/lib/site-videos";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() ?? "";
  const [session, categories, results] = await Promise.all([
    getViewerSession(),
    getSiteNavigationCategories(),
    searchSiteVideos(query),
  ]);
  const movieResults = results.filter(
    (video) => formatVideoTypeLabel(video.type) === "电影",
  );
  const seriesResults = results.filter(
    (video) => formatVideoTypeLabel(video.type) !== "电影",
  );
  const recommendationKeywords = categories.slice(0, 5).map((category) => category.name);

  return (
    <SiteShell
      categories={categories}
      searchQuery={query}
      activeNav="discover"
      hideHeaderSearch
      viewer={session?.user}
    >
      <div className="space-y-10">
        <section className="mx-auto max-w-4xl space-y-8 pt-10 text-center">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.35em] text-[#8f8d97]">发现频道</p>
            <h1 className="font-serif text-5xl text-white sm:text-6xl">探索光影世界</h1>
            <p className="mx-auto max-w-3xl text-base leading-8 text-[#b8b6bf]">
              第一版搜索只支持标题与标签，不做全文检索，也不提供联想推荐。
            </p>
          </div>

          <form
            action="/search"
            className="flex flex-col gap-3 rounded-[24px] border border-white/6 bg-[#202020] p-3 shadow-[0_25px_80px_rgba(0,0,0,0.24)] sm:flex-row"
          >
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="搜索电影、剧集、标签..."
              className="h-14 flex-1 rounded-[18px] bg-transparent px-5 text-lg text-white outline-none placeholder:text-[#777580]"
            />
            <button
              type="submit"
              className="h-14 rounded-[18px] bg-[#b8c4ff] px-8 text-sm font-semibold text-[#132977] transition hover:brightness-110"
            >
              搜索
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#8f8d97]">
            <span>热搜推荐</span>
            {recommendationKeywords.map((keyword) => (
              <a
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="rounded-full border border-white/6 bg-[#1d1d1d] px-3 py-1.5 text-[#d4d2da] transition hover:border-[#b8c4ff]/18 hover:text-white"
              >
                {keyword}
              </a>
            ))}
          </div>
        </section>

        {!query ? (
          <section className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <p className="text-xs tracking-[0.35em] text-[#b8c4ff]/70">等待输入</p>
            <h2 className="mt-4 font-serif text-4xl text-white">输入片名或标签开始搜索</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b8b6bf]">
              你可以直接输入片名，也可以尝试分类名或已同步的标签关键词。
            </p>
          </section>
        ) : results.length === 0 ? (
          <section className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <p className="text-xs tracking-[0.35em] text-[#b8c4ff]/70">没有结果</p>
            <h2 className="mt-4 font-serif text-4xl text-white">没有找到“{query}”</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b8b6bf]">
              试试更短的片名、别名，或者用分类和标签重新搜索。
            </p>
          </section>
        ) : (
          <section className="space-y-12">
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-[26px] border border-white/6 bg-[#151515] px-6 py-6">
              <div>
                <p className="text-xs tracking-[0.35em] text-[#8f8d97]">搜索结果</p>
                <h2 className="mt-3 font-serif text-4xl text-white">
                  为“{query}”找到 {results.length} 部内容
                </h2>
              </div>
              <p className="text-sm text-[#8f8d97]">按标题与标签匹配结果展示</p>
            </div>

            {movieResults.length > 0 ? (
              <section className="space-y-6">
                <div>
                  <h3 className="text-3xl font-serif text-white">电影搜索结果</h3>
                  <p className="mt-2 text-sm text-[#8f8d97]">共 {movieResults.length} 部相关影片</p>
                </div>
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                  {movieResults.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            ) : null}

            {seriesResults.length > 0 ? (
              <section className="space-y-6">
                <div>
                  <h3 className="text-3xl font-serif text-white">剧集搜索结果</h3>
                  <p className="mt-2 text-sm text-[#8f8d97]">共 {seriesResults.length} 部相关内容</p>
                </div>
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                  {seriesResults.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            ) : null}
          </section>
        )}
      </div>
    </SiteShell>
  );
}

