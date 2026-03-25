import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site/site-shell";
import { VideoCard } from "@/components/site/video-card";
import { VideoPlayer } from "@/components/site/video-player";
import {
  formatDurationLabel,
  formatVideoFormatLabel,
  formatVideoTypeLabel,
} from "@/lib/site-format";
import {
  getSiteNavigationCategories,
  getVideoDetailPageData,
} from "@/lib/site-videos";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VideoDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const [categories, result] = await Promise.all([
    getSiteNavigationCategories(),
    getVideoDetailPageData(resolvedParams.slug),
  ]);

  if (!result) {
    notFound();
  }

  const { video, relatedVideos } = result;
  const primarySource = video.sources[0];
  const firstEpisode = video.episodes.find((episode) => episode.sourceUrl);
  const playableUrl = primarySource?.sourceUrl ?? firstEpisode?.sourceUrl ?? null;
  const playableFormat = primarySource?.format ?? null;
  const metaItems = [
    video.year ? String(video.year) : null,
    video.region,
    video.language,
    formatVideoTypeLabel(video.type),
    formatDurationLabel(video.durationSeconds),
  ].filter(Boolean);

  return (
    <SiteShell categories={categories} activeNav="discover">
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-[32px] border border-white/6 bg-[#141414] shadow-[0_32px_110px_rgba(0,0,0,0.28)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={
              video.coverUrl ?? video.posterUrl
                ? {
                    backgroundImage: `url(${video.coverUrl ?? video.posterUrl})`,
                  }
                : undefined
            }
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/58 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/10 to-transparent" />

          <div className="relative flex min-h-[420px] items-end px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
            <div className="max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#dbe0ff]">
                {formatVideoFormatLabel(playableFormat) ? (
                  <span className="rounded-full border border-[#b8c4ff]/18 bg-[#b8c4ff]/10 px-3 py-1.5">
                    {formatVideoFormatLabel(playableFormat)}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-white/80">
                  {formatVideoTypeLabel(video.type)}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-5xl text-white sm:text-6xl">{video.title}</h1>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#c8c6cf]">
                  {metaItems.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <p className="max-w-2xl text-base leading-8 text-[#d0ced6]">
                {video.description ?? video.subtitle ?? "这部影片已经发布到前台片库，可以继续浏览详情与播放源。"}
              </p>

              <div className="flex flex-wrap gap-3">
                {playableUrl ? (
                  <a
                    href="#player"
                    className="rounded-xl bg-[#b8c4ff] px-6 py-3 text-sm font-semibold text-[#132977] transition hover:brightness-110"
                  >
                    立即播放
                  </a>
                ) : null}
                {video.category ? (
                  <Link
                    href={`/category/${video.category.slug}`}
                    className="rounded-xl border border-white/8 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                  >
                    查看分类
                  </Link>
                ) : (
                  <Link
                    href="/search"
                    className="rounded-xl border border-white/8 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                  >
                    返回搜索
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_360px]">
          <div className="space-y-8">
            <section id="player" className="space-y-4">
              <div>
                <p className="text-xs tracking-[0.35em] text-[#8f8d97]">在线播放</p>
                <h2 className="mt-3 font-serif text-3xl text-white">主播放区</h2>
              </div>

              {playableUrl ? (
                <VideoPlayer
                  src={playableUrl}
                  format={playableFormat}
                  poster={video.coverUrl ?? video.posterUrl}
                  title={video.title}
                />
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                  <p className="text-xs tracking-[0.35em] text-[#b8c4ff]/70">暂时不可播放</p>
                  <h3 className="mt-4 font-serif text-4xl text-white">当前还没有可用播放源</h3>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b8b6bf]">
                    这部影片已经进入已发布片库，但 OpenClaw 还没有同步可播放的源地址。
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-[28px] border border-white/6 bg-[#151515] px-6 py-6">
              <p className="text-xs tracking-[0.35em] text-[#8f8d97]">剧情简介</p>
              <p className="mt-4 text-base leading-8 text-[#c6c4cc]">
                {video.description ?? video.subtitle ?? "暂时没有补充简介，后续可由采集接口或后台继续完善。"}
              </p>
            </section>

            <section className="space-y-5 rounded-[28px] border border-white/6 bg-[#151515] px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.35em] text-[#8f8d97]">播放列表</p>
                  <h2 className="mt-3 font-serif text-3xl text-white">分集与源地址</h2>
                </div>
                <p className="text-sm text-[#8f8d97]">
                  {video.episodes.length > 0
                    ? `${video.episodes.length} 集已同步`
                    : `${video.sources.length} 个源地址`}
                </p>
              </div>

              {video.episodes.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
                  {video.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="rounded-[18px] border border-white/6 bg-[#1d1d1d] px-4 py-4"
                    >
                      <p className="text-lg font-semibold text-white">{episode.episodeNo}</p>
                      <p className="mt-2 line-clamp-1 text-sm text-[#c8c6cf]">
                        {episode.title || `第 ${episode.episodeNo} 集`}
                      </p>
                      <p className="mt-2 text-xs text-[#8f8d97]">
                        {episode.sourceUrl ? "已同步播放源" : "暂无源地址"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : video.sources.length > 0 ? (
                <div className="space-y-3">
                  {video.sources.map((source) => (
                    <div
                      key={source.id}
                      className="rounded-[18px] border border-white/6 bg-[#1d1d1d] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">
                          {source.sourceType}
                          {formatVideoFormatLabel(source.format)
                            ? ` · ${formatVideoFormatLabel(source.format)}`
                            : ""}
                        </p>
                        {source.resolution ? (
                          <span className="rounded-full bg-[#25315f]/60 px-3 py-1 text-xs text-[#dde1ff]">
                            {source.resolution}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 break-all text-sm text-[#9d9ba5]">{source.sourceUrl}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9d9ba5]">还没有同步任何分集或播放源信息。</p>
              )}
            </section>

            <section className="space-y-4 rounded-[28px] border border-white/6 bg-[#151515] px-6 py-6">
              <p className="text-xs tracking-[0.35em] text-[#8f8d97]">标签与资料</p>
              <div className="flex flex-wrap gap-2">
                {video.tags.length > 0 ? (
                  video.tags.map((item) => (
                    <Link
                      key={item.id}
                      href={`/search?q=${encodeURIComponent(item.tag.name)}`}
                      className="rounded-full border border-white/6 bg-[#1f1f1f] px-4 py-2 text-sm text-[#d8d6dd] transition hover:border-[#b8c4ff]/16 hover:text-white"
                    >
                      {item.tag.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-[#9d9ba5]">当前还没有同步标签。</p>
                )}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/6 bg-[#151515] px-6 py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.35em] text-[#8f8d97]">观影短评</p>
                  <h2 className="mt-3 font-serif text-3xl text-white">评论能力即将上线</h2>
                </div>
                <span className="rounded-full bg-[#243a9c] px-3 py-1 text-xs font-semibold text-[#dde1ff]">
                  计划中
                </span>
              </div>
              <p className="mt-4 text-base leading-8 text-[#b8b6bf]">
                当前版本先保证浏览、搜索和播放流程稳定，短评与互动功能将在下一阶段逐步接入。
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-[18px] border border-[#b8c4ff]/16 bg-[#b8c4ff]/10 px-4 py-3 text-sm font-semibold text-[#dbe0ff]"
              >
                收藏功能
              </button>
              <button
                type="button"
                className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white"
              >
                分享页面
              </button>
            </div>

            <section className="space-y-4 rounded-[28px] border border-white/6 bg-[#151515] px-5 py-6">
              <div>
                <p className="text-xs tracking-[0.35em] text-[#8f8d97]">猜你喜欢</p>
                <h2 className="mt-3 font-serif text-3xl text-white">继续看点别的</h2>
              </div>

              <div className="space-y-4">
                {relatedVideos.slice(0, 3).map((relatedVideo) => (
                  <Link
                    key={relatedVideo.id}
                    href={`/videos/${relatedVideo.slug}`}
                    className="flex gap-3 rounded-[20px] border border-white/6 bg-[#1d1d1d] p-3 transition hover:border-[#b8c4ff]/18 hover:bg-[#212121]"
                  >
                    <div
                      className="h-24 w-32 flex-none rounded-[16px] bg-cover bg-center"
                      style={
                        relatedVideo.coverUrl ?? relatedVideo.posterUrl
                          ? {
                              backgroundImage: `url(${relatedVideo.coverUrl ?? relatedVideo.posterUrl})`,
                            }
                          : undefined
                      }
                    />
                    <div className="min-w-0 space-y-2">
                      <p className="line-clamp-1 text-sm font-semibold text-white">{relatedVideo.title}</p>
                      <p className="text-xs text-[#8f8d97]">
                        {[relatedVideo.year, relatedVideo.category?.name].filter(Boolean).join(" · ") ||
                          "同类推荐"}
                      </p>
                    </div>
                  </Link>
                ))}

                {relatedVideos.length === 0 ? (
                  <p className="text-sm text-[#9d9ba5]">当前还没有可展示的相关推荐。</p>
                ) : null}
              </div>
            </section>

            <div className="overflow-hidden rounded-[28px] border border-[#b8c4ff]/12 bg-[linear-gradient(135deg,#1d2445,#171717)] px-5 py-6">
              <p className="text-xs tracking-[0.35em] text-[#b8c4ff]">高级观影体验</p>
              <h3 className="mt-3 font-serif text-3xl text-white">沉浸式播放专区</h3>
              <p className="mt-4 text-sm leading-7 text-[#c6c4cc]">
                当前页面已经支持直链与 M3U8 播放，后续会继续补足收藏、评论和更多运营位能力。
              </p>
              <button
                type="button"
                className="mt-6 w-full rounded-[16px] bg-[#b8c4ff] px-4 py-3 text-sm font-semibold text-[#132977]"
              >
                查看开发进度
              </button>
            </div>
          </aside>
        </div>

        {relatedVideos.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.35em] text-[#8f8d97]">相关推荐</p>
                <h2 className="mt-3 font-serif text-4xl text-white">你可能还会喜欢</h2>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteShell>
  );
}
