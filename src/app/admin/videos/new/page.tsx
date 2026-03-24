import Link from "next/link";

import { AdminVideoForm } from "@/components/admin/admin-video-form";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";

export default async function NewAdminVideoPage() {
  await requireSuperAdminPageSession();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4 rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
              Manual Video Entry
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl">
              Create a video record
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Use this form for editorial or cleanup work. OpenClaw can still
              populate the library automatically through the internal ingest
              APIs, but this page gives you a controlled manual path as well.
            </p>
          </div>

          <Link
            href="/admin/videos"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            Back to videos
          </Link>
        </header>

        <AdminVideoForm />
      </div>
    </main>
  );
}
