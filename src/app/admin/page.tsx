import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";

export default async function AdminPage() {
  const session = await requireSuperAdminPageSession();

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
        </>
      }
    >
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
            <p>4. 如采集异常，第一时间检查 ingest 日志。</p>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            当前登录
          </p>
          <p className="mt-4 text-lg font-semibold text-white">
            {session.user.email}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            当前后台只保留一个超级管理员账号，所有运营与采集修正都由这一个入口完成。
          </p>
        </article>
      </section>
    </AdminShell>
  );
}
