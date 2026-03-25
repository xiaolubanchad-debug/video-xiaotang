import Link from "next/link";

import { AdminTagsManager } from "@/components/admin/admin-tags-manager";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  await requireSuperAdminPageSession();

  const tags = await prisma.tag.findMany({
    orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      updatedAt: true,
      _count: {
        select: {
          videos: true,
        },
      },
    },
    take: 120,
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
              Tag management
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Tags support title-plus-tag search, related content grouping, and
              homepage storytelling. Reuse them consistently.
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

        <AdminTagsManager
          tags={tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            color: tag.color,
            videoCount: tag._count.videos,
            updatedAtLabel: tag.updatedAt.toLocaleString("zh-CN"),
          }))}
        />
      </div>
    </main>
  );
}
