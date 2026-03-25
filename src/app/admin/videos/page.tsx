import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminVideoDeleteButton } from "@/components/admin/admin-video-delete-button";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const session = await requireSuperAdminPageSession();

  const videos = await prisma.video.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      sources: {
        select: {
          sourceUrl: true,
        },
        take: 1,
      },
    },
    take: 50,
  });

  return (
    <AdminShell
      section="videos"
      userEmail={session.user.email}
      eyebrow="内容资料库"
      title="视频管理"
      description="手动新增和 OpenClaw 采集入库的内容会汇总在同一个视频库里。这里负责审核、修正、发布与下架。"
      actions={
        <>
          <Link
            href="/admin/banners"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            管理 Banner
          </Link>
          <Link
            href="/admin/videos/new"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
          >
            新增视频
          </Link>
        </>
      }
    >
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 md:grid">
          <p>视频</p>
          <p>状态</p>
          <p>来源</p>
          <p>更新时间</p>
          <p>操作</p>
        </div>

        <div className="divide-y divide-white/10">
          {videos.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-300">
              还没有视频。你可以从后台手动新增第一条内容，或者让 OpenClaw 通过 ingest API 先推一条进来。
            </div>
          ) : (
            videos.map((video) => (
              <article
                key={video.id}
                className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]"
              >
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 md:hidden">
                    视频
                  </p>
                  <h2 className="text-lg font-semibold text-white">{video.title}</h2>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    {video.category?.name ? (
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">
                        {video.category.name}
                      </span>
                    ) : null}
                    {video.tags.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full border border-white/10 px-3 py-1"
                      >
                        {item.tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 md:hidden">
                    状态
                  </p>
                  <p className="font-medium text-white">{video.status}</p>
                  <p className="mt-2">Slug: {video.slug}</p>
                </div>

                <div className="text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 md:hidden">
                    来源
                  </p>
                  <p className="font-medium text-white">{video.sourceProvider}</p>
                  <p className="mt-2 break-all">
                    {video.sources[0]?.sourceUrl ?? "暂无播放源地址"}
                  </p>
                </div>

                <div className="text-sm text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 md:hidden">
                    更新时间
                  </p>
                  <p className="font-medium text-white">
                    {video.updatedAt.toLocaleString("zh-CN")}
                  </p>
                  <p className="mt-2">播放量：{video.viewCount}</p>
                </div>

                <div className="flex flex-wrap items-start gap-2">
                  <p className="w-full text-xs uppercase tracking-[0.3em] text-slate-500 md:hidden">
                    操作
                  </p>
                  <Link
                    href={`/admin/videos/${video.id}/edit`}
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    编辑
                  </Link>
                  <AdminVideoDeleteButton
                    videoId={video.id}
                    title={video.title}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  );
}
