import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/site/favorite-button";
import { SiteShell } from "@/components/site/site-shell";
import { VideoCommentForm } from "@/components/site/video-comment-form";
import { getViewerSession } from "@/lib/auth";
import { isVideoFavoritedByViewer } from "@/lib/site-account";
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

function formatDateLabel(value?: Date | null) {
  if (!value) {
    return "待补充";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export default async function VideoDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const [session, categories, result] = await Promise.all([
    getViewerSession(),
    getSiteNavigationCategories(),
    getVideoDetailPageData(resolvedParams.slug),
  ]);

  if (!result) {
    notFound();
  }

  const { video, relatedVideos } = result;
  const isFavorited =
    session?.user?.id
      ? await isVideoFavoritedByViewer(session.user.id, video.id)
      : false;
  const primarySource = video.sources[0];
  const firstEpisode = video.episodes.find((episode) => episode.sourceUrl);
  const playableUrl = primarySource?.sourceUrl ?? firstEpisode?.sourceUrl ?? null;
  const playableFormat = primarySource?.format ?? null;
  const formatLabel = formatVideoFormatLabel(playableFormat);
  const metaItems = [
    video.year ? String(video.year) : null,
    video.region,
    video.language,
    formatVideoTypeLabel(video.type),
    formatDurationLabel(video.durationSeconds),
  ].filter(Boolean);
  const sourceLabel = primarySource?.sourceType ?? (firstEpisode ? "单集源地址" : "暂未同步");
  const statCards = [
    {
      label: "视频类型",
      value: formatVideoTypeLabel(video.type),
    },
    {
      label: "播放格式",
      value: formatLabel ?? "待识别",
    },
    {
      label: "上线时间",
      value: formatDateLabel(video.publishedAt),
    },
    {
      label: "主源标记",
      value: sourceLabel,
    },
  ];

  return (
    <SiteShell categories={categories} activeNav="discover" viewer={session?.user}>
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/66 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/10 to-transparent" />

          <div className="relative flex min-h-[420px] items-end px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
            <div className="max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#dbe0ff]">
                {formatLabel ? (
                  <span className="rounded-full border border-[#b8c4ff]/18 bg-[#b8c4ff]/10 px-3 py-1.5">
                    {formatLabel}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-white/80">
                  {formatVideoTypeLabel(video.type)}
                </span>
                {video.category ? (
                  <Link
                    href={`/category/${video.category.slug}`}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-white/80 transition hover:bg-white/[0.08]"
                  >
                    {video.category.name}
                  </Link>
                ) : null}
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
                {video.description ??
                  video.subtitle ??
                  "这部影片已经发布到前台片库，当前版本聚焦单集视频播放体验。"}
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
                <Link
                  href={video.category ? `/category/${video.category.slug}` : "/search"}
                  className="rounded-xl border border-white/8 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  {video.category ? "查看更多同类影片" : "返回搜索页"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_360px]">
          <div className="space-y-8">
            <section id="player" className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.35em] text-[#8f8d97]">在线播放</p>
                  <h2 className="mt-3 font-serif text-3xl text-white">主播放区</h2>
                </div>
                <div className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-xs text-[#c8c6cf]">
                  当前版本仅支持单集视频播放
                </div>
              </div>

              {playableUrl ? (
                <div className="space-y-4">
                  <VideoPlayer
                    src={playableUrl}
                    format={playableFormat}
                    poster={video.coverUrl ?? video.posterUrl}
                    title={video.title}
                    videoId={video.id}
                    shouldTrackHistory={Boolean(session?.user?.id)}
                  />
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[24px] border border-white/6 bg-[#151515] px-5 py-5"
                      >
                        <p className="text-xs tracking-[0.28em] text-[#8f8d97]">{item.label}</p>
                        <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                  <p className="text-xs tracking-[0.35em] text-[#b8c4ff]/70">暂时不可播放</p>
                  <h3 className="mt-4 font-serif text-4xl text-white">当前还没有可用播放源</h3>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b8b6bf]">
                    这部影片已经进入已发布片库，但 OpenClaw 还没有同步可播放的源地址。你可以先返回首页继续浏览，或稍后再来查看。
                  </p>
                </div>
              )}
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <article className="rounded-[28px] border border-white/6 bg-[#151515] px-6 py-6">
                <p className="text-xs tracking-[0.35em] text-[#8f8d97]">剧情简介</p>
                <p className="mt-4 text-base leading-8 text-[#c6c4cc]">
                  {video.description ??
                    video.subtitle ??
                    "暂时没有补充简介，后续可由采集接口或后台继续完善。"}
                </p>
              </article>

              <article className="rounded-[28px] border border-white/6 bg-[#151515] px-6 py-6">
                <p className="text-xs tracking-[0.35em] text-[#8f8d97]">当前源信息</p>
                <div className="mt-4 space-y-4 text-sm text-[#c6c4cc]">
                  <div className="rounded-[20px] border border-white/6 bg-[#1d1d1d] px-4 py-4">
                    <p className="text-xs tracking-[0.25em] text-[#8f8d97]">主源类型</p>
                    <p className="mt-2 text-base font-semibold text-white">{sourceLabel}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/6 bg-[#1d1d1d] px-4 py-4">
                    <p className="text-xs tracking-[0.25em] text-[#8f8d97]">播放格式</p>
                    <p className="mt-2 text-base font-semibold text-white">{formatLabel ?? "待识别"}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/6 bg-[#1d1d1d] px-4 py-4">
                    <p className="text-xs tracking-[0.25em] text-[#8f8d97]">源地址状态</p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {playableUrl ? "已同步，可直接播放" : "尚未同步播放源"}
                    </p>
                  </div>
                </div>
              </article>
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
                  <h2 className="mt-3 font-serif text-3xl text-white">已审核评论</h2>
                </div>
                <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-[#dbe0ff]">
                  {video.comments.length} 条展示中
                </span>
              </div>

              <VideoCommentForm videoId={video.id} viewer={session?.user} />

              {video.comments.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {video.comments.map((comment) => (
                    <article
                      key={comment.id}
                      className="rounded-[22px] border border-white/6 bg-[#1d1d1d] px-5 py-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {comment.user.nickname || comment.user.email || "匿名观众"}
                          </p>
                          <p className="mt-1 text-xs text-[#8f8d97]">
                            {formatDateLabel(comment.createdAt)}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/8 px-3 py-1 text-xs text-[#c8c6cf]">
                          {comment.likeCount} 次赞同
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[#d1cfd6]">{comment.content}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-sm leading-7 text-[#b8b6bf]">
                  当前还没有已审核短评。等后台评论审核模块开启后，这里会展示通过审核的用户评论。
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/search"
                className="rounded-[18px] border border-[#b8c4ff]/16 bg-[#b8c4ff]/10 px-4 py-3 text-center text-sm font-semibold text-[#dbe0ff]"
              >
                继续找片
              </Link>
              <a
                href={playableUrl ?? "#player"}
                className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                {playableUrl ? "打开播放源" : "查看播放区"}
              </a>
            </div>

            <section className="rounded-[28px] border border-white/6 bg-[#151515] px-5 py-6">
              <p className="text-xs tracking-[0.35em] text-[#8f8d97]">个人操作</p>
              <h2 className="mt-3 font-serif text-3xl text-white">把它收进你的片单</h2>
              <p className="mt-3 text-sm leading-7 text-[#c6c4cc]">
                当前收藏数 {video.favoriteCount}，已审核评论 {video.commentCount}。登录后可直接收藏，稍后从“我的收藏”继续观看。
              </p>
              <div className="mt-5">
                <FavoriteButton
                  videoId={video.id}
                  initialFavorited={isFavorited}
                  initialCount={video.favoriteCount}
                  isLoggedIn={Boolean(session?.user?.id)}
                />
              </div>
            </section>

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
              <p className="text-xs tracking-[0.35em] text-[#b8c4ff]">单集播放模式</p>
              <h3 className="mt-3 font-serif text-3xl text-white">当前版本聚焦播放稳定</h3>
              <p className="mt-4 text-sm leading-7 text-[#c6c4cc]">
                这一版不做分集切换，只保证采集进来的单视频内容能够稳定展示、搜索和播放。后续需要扩展时，再继续接入更复杂的剧集模型。
              </p>
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


