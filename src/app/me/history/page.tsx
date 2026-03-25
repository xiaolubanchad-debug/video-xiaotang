import Link from "next/link";

import { MeNav } from "@/components/site/me-nav";
import { SiteShell } from "@/components/site/site-shell";
import { requireViewerPageSession } from "@/lib/auth";
import { listViewerWatchHistory } from "@/lib/site-account";
import { getSiteNavigationCategories } from "@/lib/site-videos";

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function MyHistoryPage() {
  const session = await requireViewerPageSession();
  const [categories, history] = await Promise.all([
    getSiteNavigationCategories(),
    listViewerWatchHistory(session.user.id),
  ]);

  return (
    <SiteShell categories={categories} activeNav="discover" viewer={session.user}>
      <div className="space-y-8">
        <section className="space-y-6 rounded-[30px] border border-white/6 bg-[#151515] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:px-8">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl text-white sm:text-6xl">最近观看</h1>
            <p className="max-w-3xl text-base leading-8 text-[#b6b4bc]">
              这里会记录你最近播放过的视频和大致观看进度。当前版本只记录历史，不自动从断点续播。
            </p>
          </div>

          <MeNav activeHref="/me/history" />
        </section>

        {history.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm leading-7 text-slate-300">
            你还没有观看记录。登录后播放任意视频，这里就会出现最近观看内容。
          </section>
        ) : (
          <section className="space-y-4">
            {history.map((item) => (
              <article
                key={item.id}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>{formatDateLabel(item.watchedAt)}</span>
                      <span>已观看约 {item.progressSeconds} 秒</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-white">{item.video.title}</h2>
                    <p className="text-sm text-slate-300">
                      {[item.video.year, item.video.category?.name, item.video.region]
                        .filter(Boolean)
                        .join(" / ") || "已发布视频"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/videos/${item.video.slug}`}
                      className="rounded-full bg-[#b8c4ff] px-5 py-3 text-sm font-semibold text-[#0b1020] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] transition hover:bg-[#cad2ff]"
                    >
                      回到详情页
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </SiteShell>
  );
}
