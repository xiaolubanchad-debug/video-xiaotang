import Link from "next/link";

import { AdminCategoriesManager } from "@/components/admin/admin-categories-manager";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireSuperAdminPageSession();

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      sortOrder: true,
      status: true,
      updatedAt: true,
      _count: {
        select: {
          videos: true,
        },
      },
    },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Taxonomy
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl">
              Category management
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Categories drive front-end navigation, search recommendations, and
              video grouping. Keep them small, clear, and stable.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              Back to dashboard
            </Link>
            <Link
              href="/admin/videos"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              Open videos
            </Link>
          </div>
        </header>

        <AdminCategoriesManager
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            sortOrder: category.sortOrder,
            status: category.status,
            videoCount: category._count.videos,
            updatedAtLabel: category.updatedAt.toLocaleString("zh-CN"),
          }))}
        />
      </div>
    </main>
  );
}
