import Link from "next/link";
import { ReactNode } from "react";

type AdminSection =
  | "dashboard"
  | "videos"
  | "homeSections"
  | "comments"
  | "categories"
  | "tags"
  | "banners"
  | "ingest";

type Props = {
  section: AdminSection;
  userEmail?: string | null;
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navItems: Array<{
  section: AdminSection;
  label: string;
  description: string;
  href: string;
}> = [
  {
    section: "dashboard",
    label: "控制台",
    description: "后台总览与快捷入口",
    href: "/admin",
  },
  {
    section: "videos",
    label: "视频管理",
    description: "维护视频资料、状态与来源",
    href: "/admin/videos",
  },
  {
    section: "homeSections",
    label: "首页内容区块",
    description: "维护热门推荐和站长精选",
    href: "/admin/home-sections",
  },
  {
    section: "banners",
    label: "首页 Banner",
    description: "管理首页主视觉与跳转入口",
    href: "/admin/banners",
  },
  {
    section: "comments",
    label: "评论管理",
    description: "审核、隐藏和清理评论内容",
    href: "/admin/comments",
  },
  {
    section: "categories",
    label: "分类管理",
    description: "整理前台频道和导航结构",
    href: "/admin/categories",
  },
  {
    section: "tags",
    label: "标签管理",
    description: "维护搜索和内容发现标签",
    href: "/admin/tags",
  },
  {
    section: "ingest",
    label: "采集日志",
    description: "查看 OpenClaw 推送结果",
    href: "/admin/ingest-logs",
  },
];

export function AdminShell({
  section,
  userEmail,
  eyebrow,
  title,
  description,
  actions,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#12314d_0%,#07111b_34%,#020406_100%)] px-4 py-4 text-white sm:px-6 sm:py-6">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Video Xiaotang
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl">
              CMS 后台
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              单超级管理员运营台，围绕视频库、首页编排和 OpenClaw 采集链路搭建。
            </p>
          </div>

          <div className="mt-6 rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
              当前账号
            </p>
            <p className="mt-2 text-sm font-semibold text-emerald-100">
              {userEmail ?? "未登录"}
            </p>
          </div>

          <nav className="mt-6 space-y-3">
            {navItems.map((item) => {
              const active = item.section === section;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-[24px] border px-4 py-4 transition ${
                    active
                      ? "border-cyan-300/25 bg-cyan-300/10"
                      : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              返回前台
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              重新登录
            </Link>
          </div>
        </aside>

        <div className="space-y-6">
          <header className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              {eyebrow}
            </p>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <h2 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl">
                  {title}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  {description}
                </p>
              </div>

              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </header>

          {children}
        </div>
      </div>
    </main>
  );
}
