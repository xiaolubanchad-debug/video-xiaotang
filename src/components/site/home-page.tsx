import Link from "next/link";

import { getViewerSession } from "@/lib/auth";
import { homePageSectionDefinitions } from "@/lib/home-sections";
import { getHomePageData, getSiteNavigationCategories } from "@/lib/site-videos";
import {
  formatCompactDuration,
  formatVideoFormatLabel,
  formatVideoTypeLabel,
} from "@/lib/site-format";

import { SiteShell } from "./site-shell";
import { VideoCard } from "./video-card";

export async function HomePage() {
  const [session, categories, data] = await Promise.all([
    getViewerSession(),
    getSiteNavigationCategories(),
    getHomePageData(),
  ]);

  const featuredBanner = data.heroBanners[0];
  const lead = featuredBanner?.video ?? data.heroVideos[0];
  const heroBackground =
    featuredBanner?.imageUrl ?? lead?.coverUrl ?? lead?.posterUrl ?? undefined;
  const heroTitle = featuredBanner?.title ?? lead?.title ?? "今日精选";
  const heroDescription =
    lead?.description ??
    lead?.subtitle ??
    "来自最新片库的一线内容，已经同步到前台站点等待观众发现。";
  const heroPrimaryHref = featuredBanner?.video
    ? `/videos/${featuredBanner.video.slug}`
    : featuredBanner?.targetUrl ?? (lead ? `/videos/${lead.slug}` : "/search");
  const heroPrimaryLabel = featuredBanner?.video || lead ? "立即观看" : "查看专题";
  const isExternalHeroLink = /^https?:\/\//.test(heroPrimaryHref);

  const sectionData = {
    hot: data.sections.hotPicks,
    latest: data.sections.latestUpdates,
    editor: data.sections.editorPicks,
    guess: data.sections.guessYouLike,
  };

  return (
    <SiteShell categories={categories} activeNav="home" viewer={session?.user}>
      <div className="space-y-14">
        {lead || featuredBanner ? (
          <section className="relative min-h-[620px] overflow-hidden rounded-[34px] border border-white/6 bg-[#161616] shadow-[0_30px_120px_rgba(0,0,0,0.38)] lg:min-h-[680px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={
                heroBackground
                  ? {
                      backgroundImage: `url(${heroBackground})`,
                    }
                  : undefined
              }
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,transparent_0%,rgba(19,19,19,0.16)_28%,rgba(19,19,19,0.88)_78%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />

            <div className="relative flex min-h-[620px] flex-col justify-end px-7 py-10 sm:px-10 lg:min-h-[680px] lg:px-12">
              <div className="max-w-3xl space-y-6 pb-12 lg:pb-28">
                <div className="space-y-4">
                  <h1 className="font-serif text-4xl font-semibold leading-none tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                    {heroTitle}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[#d0ced6]">
                    {heroDescription}
                  </p>
                </div>

                {lead ? (
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
                ) : null}

                <div className="flex flex-wrap gap-3">
                  {isExternalHeroLink ? (
                    <a
                      href={heroPrimaryHref}
                      className="rounded-xl bg-[#b8c4ff] px-6 py-3 text-sm font-semibold text-[#132977] transition hover:brightness-110"
                    >
                      {heroPrimaryLabel}
                    </a>
                  ) : (
                    <Link
                      href={heroPrimaryHref}
                      className="rounded-xl bg-[#b8c4ff] px-6 py-3 text-sm font-semibold text-[#132977] transition hover:brightness-110"
                    >
                      {heroPrimaryLabel}
                    </Link>
                  )}

                  {lead?.category ? (
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
            <h1 className="font-serif text-5xl text-white">还没有已发布内容</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b8b6bf]">
              你可以先通过 OpenClaw 的采集接口推送第一条视频，或者从后台手动新增内容并发布。
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

        {homePageSectionDefinitions.map((section) => {
          const videos = sectionData[section.key];

          return (
            <section key={section.key} className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-4xl text-white">{section.title}</h2>
                </div>
                {section.key === "latest" ? (
                  <Link href="/search" className="text-sm font-semibold text-[#b8c4ff] transition hover:underline">
                    查看全部
                  </Link>
                ) : null}
              </div>

              {videos.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm text-slate-300">
                  当前区块暂时没有可展示内容。
                </div>
              )}
            </section>
          );
        })}
      </div>
    </SiteShell>
  );
}
