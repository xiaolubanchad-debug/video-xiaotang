import Link from "next/link";

import { CommentStatus, VideoStatus } from "@prisma/client";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await requireSuperAdminPageSession();
  const [videoCount, publishedVideoCount, pendingCommentCount, userCount] =
    await prisma.$transaction([
      prisma.video.count(),
      prisma.video.count({
        where: {
          status: VideoStatus.PUBLISHED,
        },
      }),
      prisma.comment.count({
        where: {
          status: CommentStatus.PENDING,
        },
      }),
      prisma.user.count({
        where: {
          isSuperAdmin: false,
        },
      }),
    ]);

  return (
    <AdminShell
      section="dashboard"
      userEmail={session.user.email}
      eyebrow="运营总览"
      title="CMS 控制台"
      description="这里是当前项目的后台总入口。核心围绕视频库维护、首页编排，以及 OpenClaw 采集后的运营纠偏。"
      actions={
        <>
          <Link
            href="/admin/videos/new"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
          >
            新增视频
          </Link>
          <Link
            href="/admin/home-sections"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            首页区块
          </Link>
          <Link
            href="/admin/banners"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            管理 Banner
          </Link>
          <Link
            href="/admin/comments"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            评论管理
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="视频总数" value={videoCount} />
        <StatCard label="已发布视频" value={publishedVideoCount} />
        <StatCard label="待审核评论" value={pendingCommentCount} />
        <StatCard label="站点用户" value={userCount} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          [
            "视频管理",
            "新增、编辑、发布、归档视频，并维护手动录入和采集入库的统一资料库。",
            "/admin/videos",
          ],
          [
            "分类与标签",
            "维护首页导航频道、搜索标签和内容归类体系，确保前台展示稳定一致。",
            "/admin/categories",
          ],
          [
            "首页推荐位",
            "通过 Banner 管理首页主视觉，控制热点内容、活动入口和视频落地页跳转。",
            "/admin/banners",
          ],
          [
            "首页内容区块",
            "维护热门推荐和站长精选两个手工编排区块，最新更新与猜你喜欢由前台自动生成。",
            "/admin/home-sections",
          ],
          [
            "评论管理",
            "集中查看评论状态，支持审核通过、隐藏和删除，先把互动内容的运营闭环跑通。",
            "/admin/comments",
          ],
          [
            "采集日志",
            "追踪 upsert、batch-upsert 和 delete 的结果，快速定位 OpenClaw 推送异常。",
            "/admin/ingest-logs",
          ],
          [
            "标签管理",
            "让搜索和推荐逻辑围绕统一的标签体系运转，减少重复词和脏数据。",
            "/admin/tags",
          ],
        ].map(([title, text, href]) => (
          <article
            key={title}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
            <Link
              href={href}
              className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              进入模块
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            推荐操作顺序
          </p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <p>1. 先在视频管理里补齐标题、封面、状态和来源。</p>
            <p>2. 用分类和标签整理前台导航与搜索命中。</p>
            <p>3. 用 Banner 管理首页主视觉和热点入口。</p>
            <p>4. 审核评论内容，确保前台展示的短评干净可控。</p>
            <p>5. 如采集异常，第一时间检查 ingest 日志。</p>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            当前登录
          </p>
          <p className="mt-4 text-lg font-semibold text-white">{session.user.email}</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            当前后台只保留一个超级管理员账号，所有运营与采集修正都由这一个入口完成。
          </p>
        </article>
      </section>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </article>
  );
}
