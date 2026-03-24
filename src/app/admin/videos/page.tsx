import Link from "next/link";

import { AdminVideoDeleteButton } from "@/components/admin/admin-video-delete-button";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  await requireSuperAdminPageSession();

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
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Video Library
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl">
              Admin video management
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Manual entries and OpenClaw ingest records land in the same video
              library. This view is the first operator surface for reviewing and
              maintaining content.
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
              href="/admin/videos/new"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Add video
            </Link>
          </div>
        </header>

        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
            <p>Video</p>
            <p>Status</p>
            <p>Source</p>
            <p>Updated</p>
            <p>Actions</p>
          </div>

          <div className="divide-y divide-white/10">
            {videos.length === 0 ? (
              <div className="px-6 py-10 text-sm text-slate-300">
                No videos yet. Create the first record from the admin form or
                push one in through the OpenClaw ingest API.
              </div>
            ) : (
              videos.map((video) => (
                <article
                  key={video.id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]"
                >
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-white">
                      {video.title}
                    </h2>
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
                    <p className="font-medium text-white">{video.status}</p>
                    <p className="mt-2">Slug: {video.slug}</p>
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="font-medium text-white">{video.sourceProvider}</p>
                    <p className="mt-2 break-all">
                      {video.sources[0]?.sourceUrl ?? "No source URL"}
                    </p>
                  </div>

                  <div className="text-sm text-slate-300">
                    <p className="font-medium text-white">
                      {video.updatedAt.toLocaleString("en-US")}
                    </p>
                    <p className="mt-2">Views: {video.viewCount}</p>
                  </div>

                  <div className="flex flex-wrap items-start gap-2">
                    <Link
                      href={`/admin/videos/${video.id}/edit`}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                    >
                      Edit
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
      </div>
    </main>
  );
}
