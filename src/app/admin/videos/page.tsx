import Link from "next/link";

import { VideoStatus } from "@prisma/client";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminVideoDeleteButton } from "@/components/admin/admin-video-delete-button";
import { AdminVideoStatusButtons } from "@/components/admin/admin-video-status-buttons";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { listAdminVideos } from "@/lib/admin-video-library";

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    provider?: string;
    category?: string;
    source?: string;
    externalId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminVideosPage({ searchParams }: Props) {
  const session = await requireSuperAdminPageSession();
  const params = await searchParams;
  const { videos, categories, filters, stats } = await listAdminVideos(params);

  return (
    <AdminShell
      section="videos"
      userEmail={session.user.email}
      eyebrow="内容资料库"
      title="视频管理"
      description="这里不只是视频列表，也是 OpenClaw 采集后的审核台。你可以快速筛出待发布内容、无播放源内容，并直接在列表里完成状态调整。"
      actions={
        <>
          <Link
            href="/admin/ingest-logs"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            查看采集日志
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
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickFilterCard label="全部视频" value={stats.total} href="/admin/videos" />
        <QuickFilterCard
          label="待审核草稿"
          value={stats.draft}
          href="/admin/videos?status=DRAFT"
        />
        <QuickFilterCard
          label="已发布"
          value={stats.published}
          href="/admin/videos?status=PUBLISHED"
        />
        <QuickFilterCard
          label="无播放源"
          value={stats.withoutSource}
          href="/admin/videos?source=without"
        />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Field label="标题关键词" name="q" defaultValue={filters.q} />
          <SelectField
            label="状态"
            name="status"
            value={filters.status}
            options={["", ...Object.values(VideoStatus)]}
            labels={{ "": "全部状态", DRAFT: "草稿", PUBLISHED: "已发布", ARCHIVED: "已归档" }}
          />
          <Field label="来源 Provider" name="provider" defaultValue={filters.provider} />
          <Field label="来源 External ID" name="externalId" defaultValue={filters.externalId} />
          <SelectField
            label="分类"
            name="category"
            value={filters.category}
            options={["", ...categories.map((category) => category.slug)]}
            labels={Object.fromEntries(categories.map((category) => [category.slug, category.name]))}
          />
          <SelectField
            label="播放源状态"
            name="source"
            value={filters.source}
            options={["", "with", "without"]}
            labels={{ "": "全部", with: "有播放源", without: "无播放源" }}
          />

          <div className="flex flex-wrap items-end gap-3 xl:col-span-6">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              应用筛选
            </button>
            <Link
              href="/admin/videos"
              className="inline-flex h-12 items-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              清空筛选
            </Link>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[1.8fr_1fr_1.3fr_0.9fr_0.9fr_1.4fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 xl:grid">
          <p>视频</p>
          <p>状态</p>
          <p>来源</p>
          <p>发布时间</p>
          <p>更新时间</p>
          <p>操作</p>
        </div>

        <div className="divide-y divide-white/10">
          {videos.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-300">
              当前筛选条件下没有视频。你可以调整筛选条件，或者先让 OpenClaw 推送一条新内容进来。
            </div>
          ) : (
            videos.map((video) => {
              const sourceUrl = video.sources[0]?.sourceUrl;

              return (
                <article
                  key={video.id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 xl:grid-cols-[1.8fr_1fr_1.3fr_0.9fr_0.9fr_1.4fr]"
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">视频</p>
                    <h2 className="text-lg font-semibold text-white">{video.title}</h2>
                    <p className="text-xs text-slate-400">Slug: {video.slug}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      {video.category?.name ? (
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">
                          {video.category.name}
                        </span>
                      ) : null}
                      {video.tags.map((item) => (
                        <span key={item.id} className="rounded-full border border-white/10 px-3 py-1">
                          {item.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">状态</p>
                    <StatusBadge status={video.status} />
                    <p className="mt-3 text-xs text-slate-400">播放量：{video.viewCount}</p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">来源</p>
                    <p className="font-medium text-white">{video.sourceProvider}</p>
                    <p className="break-all text-xs text-slate-400">External ID: {video.sourceExternalId}</p>
                    <p className="break-all text-xs text-slate-400">
                      {sourceUrl ?? "暂无播放源地址"}
                    </p>
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">发布时间</p>
                    <p className="font-medium text-white">
                      {video.publishedAt ? video.publishedAt.toLocaleString("zh-CN") : "尚未发布"}
                    </p>
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">更新时间</p>
                    <p className="font-medium text-white">{video.updatedAt.toLocaleString("zh-CN")}</p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2">
                    <p className="w-full text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">操作</p>
                    <Link
                      href={`/admin/videos/${video.id}/edit`}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                    >
                      编辑
                    </Link>
                    <Link
                      href={`/videos/${video.slug}`}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/8"
                    >
                      前台查看
                    </Link>
                    <AdminVideoStatusButtons videoId={video.id} status={video.status} />
                    <AdminVideoDeleteButton videoId={video.id} title={video.title} />
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function QuickFilterCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.08]"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </Link>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  labels,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  labels: Record<string, string>;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none"
      >
        {options.map((option) => (
          <option key={option || "all"} value={option}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({ status }: { status: VideoStatus }) {
  const styles =
    status === VideoStatus.PUBLISHED
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
      : status === VideoStatus.ARCHIVED
        ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
        : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

  const label =
    status === VideoStatus.PUBLISHED
      ? "已发布"
      : status === VideoStatus.ARCHIVED
        ? "已归档"
        : "草稿";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>{label}</span>;
}
