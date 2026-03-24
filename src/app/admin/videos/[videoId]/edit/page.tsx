import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminVideoForm } from "@/components/admin/admin-video-form";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { getVideoForAdmin } from "@/lib/admin-videos";

type PageProps = {
  params: Promise<{
    videoId: string;
  }>;
};

export default async function EditAdminVideoPage({ params }: PageProps) {
  await requireSuperAdminPageSession();

  const { videoId } = await params;
  const video = await getVideoForAdmin(videoId);

  if (!video) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Video Editor
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl">
              Edit video record
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Update metadata, source links, tags, and editorial details for
              this video entry.
            </p>
          </div>

          <Link
            href="/admin/videos"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            Back to videos
          </Link>
        </header>

        <AdminVideoForm
          apiEndpoint={`/api/admin/videos/${video.id}`}
          method="PUT"
          submitLabel="Save changes"
          initialValues={{
            title: video.title,
            subtitle: video.subtitle ?? "",
            description: video.description ?? "",
            coverUrl: video.coverUrl ?? "",
            posterUrl: video.posterUrl ?? "",
            trailerUrl: video.trailerUrl ?? "",
            sourceUrl: video.sources[0]?.sourceUrl ?? "",
            type: video.type,
            categoryName: video.category?.name ?? "",
            region: video.region ?? "",
            language: video.language ?? "",
            year: video.year,
            durationSeconds: video.durationSeconds,
            status: video.status,
            tags: video.tags.map((item) => item.tag.name),
          }}
        />
      </div>
    </main>
  );
}
