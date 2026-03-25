import Link from "next/link";

import { getHomePageData, getSiteNavigationCategories } from "@/lib/site-videos";
import {
  formatCompactDuration,
  formatVideoFormatLabel,
  formatVideoTypeLabel,
} from "@/lib/site-format";

import { SiteShell } from "./site-shell";
import { VideoCard } from "./video-card";

export async function HomePage() {
  const [categories, data] = await Promise.all([
    getSiteNavigationCategories(),
    getHomePageData(),
  ]);

  const lead = data.heroVideos[0];
  const categoryRows = data.categoryRows.slice(0, 2);
  const hotVideos = data.latestVideos.slice(0, 4);
  const spotlightVideos = data.spotlightVideos.slice(0, 4);
  const freshVideos = data.latestVideos.slice(4, 8);

  return (
    <SiteShell categories={categories} activeNav="home">
      <div className="space-y-14">
        {lead ? (
          <section className="relative min-h-[620px] overflow-hidden rounded-[34px] border border-white/6 bg-[#161616] shadow-[0_30px_120px_rgba(0,0,0,0.38)] lg:min-h-[680px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={
                lead.coverUrl ?? lead.posterUrl
                  ? {
                      backgroundImage: `url(${lead.coverUrl ?? lead.posterUrl})`,
                    }
                  : undefined
              }
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,transparent_0%,rgba(19,19,19,0.16)_28%,rgba(19,19,19,0.88)_78%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />

            <div className="relative flex min-h-[620px] flex-col justify-end px-7 py-10 sm:px-10 lg:min-h-[680px] lg:px-12">
              <div className="max-w-3xl space-y-6 pb-12 lg:pb-28">
                <span className="inline-flex rounded-full border border-[#b8c4ff]/16 bg-[#b8c4ff]/10 px-4 py-2 text-xs font-semibold tracking-[0.32em] text-[#dde1ff]">
                  PREMIUM STREAMING
                </span>

                <div className="space-y-4">
                  <h1 className="font-serif text-4xl font-semibold leading-none tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                    {lead.title}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[#d0ced6]">
                    {lead.description ??
                      lead.subtitle ??
                      "来自最新片库的一线内容，已同步到前台站点等待观众发现。"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-[#d7d5dc]">
                  {lead.category ? (
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
                      {lead.category.name}
                    </span>
                  ) : null}
                  {lead.year ? (
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
                      {lead.year}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
                    {formatVideoTypeLabel(lead.type)}
                  </span>
                  {formatVideoFormatLabel(lead.sources[0]?.format) ? (
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
                      {formatVideoFormatLabel(lead.sources[0]?.format)}
                    </span>
                  ) : null}
                  {formatCompactDuration(lead.durationSeconds) ? (
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
                      {formatCompactDuration(lead.durationSeconds)}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/videos/${lead.slug}`}
                    className="rounded-xl bg-[#b8c4ff] px-6 py-3 text-sm font-semibold text-[#132977] transition hover:brightness-110"
                  >
                    立即观看
                  </Link>
                  {lead.category ? (
                    <Link
                      href={`/category/${lead.category.slug}`}
                      className="rounded-xl border border-white/8 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      进入分类
                    </Link>
                  ) : (
                    <Link
                      href="/search"
                      className="rounded-xl border border-white/8 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      浏览片库
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="rounded-[20px] border border-white/6 bg-[#1e1d1d]/70 px-4 py-5 text-center shadow-[0_20px_45px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:border-[#b8c4ff]/24 hover:bg-[#242323]/90"
                  >
                    <p className="text-sm font-semibold text-white">{category.name}</p>
                    <p className="mt-2 text-xs text-[#87858f]">进入频道</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[34px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="text-xs tracking-[0.4em] text-[#b8c4ff]/70">片库为空</p>
            <h1 className="mt-4 font-serif text-5xl text-white">还没有已发布内容</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b8b6bf]">
              你可以先通过 OpenClaw 的采集接口推送第一条视频，
              或者从后台手动新增内容并发布。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/admin/videos/new"
                className="rounded-xl bg-[#b8c4ff] px-6 py-3 text-sm font-semibold text-[#132977] transition hover:brightness-110"
              >
                新增视频
              </Link>
              <Link
                href="/admin"
                className="rounded-xl border border-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                打开后台
              </Link>
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.35em] text-[#8e8c96]">正在热播</p>
              <h2 className="mt-3 font-serif text-4xl text-white">最新上映与更新</h2>
            </div>
            <Link href="/search" className="text-sm font-semibold text-[#b8c4ff] transition hover:underline">
              查看全部
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {hotVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#8e8c96]">本周热门推荐</p>
            <h2 className="mt-3 font-serif text-4xl text-white">编辑精选片单</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {spotlightVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {categoryRows.length > 0 ? (
          <section className="grid gap-8 xl:grid-cols-2">
            {categoryRows.map((row) => (
              <div key={row.id} className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.35em] text-[#8e8c96]">专题推荐</p>
                    <h2 className="mt-3 font-serif text-4xl text-white">{row.name}</h2>
                  </div>
                  <Link
                    href={`/category/${row.slug}`}
                    className="text-sm font-semibold text-[#b8c4ff] transition hover:underline"
                  >
                    查看全部
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {row.videos.slice(0, 4).map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <section className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#8e8c96]">最新上新</p>
            <h2 className="mt-3 font-serif text-4xl text-white">刚刚进入片库的内容</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {freshVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
