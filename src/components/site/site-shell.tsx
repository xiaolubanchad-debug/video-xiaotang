import Link from "next/link";

import { SiteAuthActions } from "./site-auth-actions";

type CategoryLink = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  categories: CategoryLink[];
  children: React.ReactNode;
  searchQuery?: string;
  activeNav?: "home" | "discover" | "category";
  hideHeaderSearch?: boolean;
  viewer?: {
    name?: string | null;
    email?: string | null;
    isSuperAdmin?: boolean;
  } | null;
};

export function SiteShell({
  categories,
  children,
  searchQuery,
  activeNav = "home",
  hideHeaderSearch = false,
  viewer,
}: Props) {
  const categoryHref = categories[0] ? `/category/${categories[0].slug}` : "/search";
  const navItems = [
    { key: "home" as const, href: "/", label: "首页" },
    { key: "discover" as const, href: "/search", label: "发现" },
    { key: "category" as const, href: categoryHref, label: "分类" },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#131313] text-[#e5e2e1]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(184,196,255,0.12),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(255,180,170,0.08),transparent_16%)]" />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#131313] via-[#131313]/78 to-transparent backdrop-blur-xl" />
        <div className="relative mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex items-center justify-between gap-8">
            <Link href="/" className="text-2xl font-bold tracking-[-0.06em] text-[#b8c4ff]">
              CINEMAMIRROR
            </Link>

            <nav className="hidden items-center gap-8 text-sm text-[#9f9da8] md:flex">
              {navItems.map((item) => {
                const isActive = item.key === activeNav;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`pb-1 transition-colors ${
                      isActive
                        ? "border-b-2 border-[#b8c4ff] font-semibold text-[#b8c4ff]"
                        : "hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!hideHeaderSearch ? (
              <form
                action="/search"
                className="flex w-full items-center gap-2 rounded-full border border-white/6 bg-[#2a2a2a]/82 px-3 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:w-auto"
              >
                <input
                  type="search"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="搜索电影、剧集、标签..."
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-[#7f7d88] sm:w-56"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#b8c4ff] px-4 py-2 text-sm font-semibold text-[#0b1020] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] transition hover:bg-[#cad2ff]"
                >
                  搜索
                </button>
              </form>
            ) : null}

            <SiteAuthActions viewer={viewer} />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-[1600px] gap-2 px-5 pb-2 sm:px-8 md:hidden lg:px-12">
          {navItems.map((item) => {
            const isActive = item.key === activeNav;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex-1 rounded-full px-4 py-2 text-center text-sm transition ${
                  isActive
                    ? "bg-[#b8c4ff] font-semibold text-[#0b1020] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]"
                    : "border border-white/6 bg-white/[0.04] text-[#d6d4dc]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 pb-10 pt-24 sm:px-8 lg:px-12">
        <div className="flex-1 py-6">{children}</div>

        <footer className="mt-16 border-t border-white/6 bg-[#0f0f0f]/92 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <p className="text-xl font-semibold tracking-[-0.04em] text-white">
                CINEMA MIRROR
              </p>
              <p className="max-w-sm text-sm leading-7 text-[#8f8d98]">
                小糖视频的前台站点，围绕电影与剧集内容做沉浸式浏览体验。所有内容由后台 CMS 和 OpenClaw 采集接口统一驱动。
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#b8c4ff]">快速链接</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#8f8d98]">
                <Link href="/">首页</Link>
                <Link href="/search">发现</Link>
                {categories.slice(0, 3).map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 md:text-right">
              <p className="text-sm font-semibold text-[#b8c4ff]">订阅站内动态</p>
              <form className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <input
                  type="email"
                  placeholder="输入邮箱地址"
                  className="rounded-xl border border-white/6 bg-[#1f1f1f] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f6d77]"
                />
                <button
                  type="button"
                  className="rounded-xl bg-[#243a9c] px-5 py-3 text-sm font-semibold text-[#dde1ff] transition hover:brightness-110"
                >
                  订阅
                </button>
              </form>
              <p className="text-xs text-[#6f6d77]">© 2026 CINEMAMIRROR. 保留所有权利。</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
