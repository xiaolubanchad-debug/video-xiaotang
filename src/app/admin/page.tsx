import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            Super Admin Console
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-cormorant)] text-5xl">
            video-xiaotang admin
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            This is the first expandable admin shell. It is centered on a
            single super-admin account, video operations, and the OpenClaw
            ingest entry points.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200">
              {session?.user?.email
                ? `Signed in as ${session.user.email}`
                : "Not signed in yet. Use the admin login page first."}
            </span>
            <Link
              href="/admin/videos"
              className="rounded-full border border-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/8"
            >
              Open videos
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Admin login
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Video Ops", "Create, edit, archive, delete, and track source links"],
            ["Placement", "Banner, featured rows, collections, and ranking slots"],
            ["Ingest APIs", "upsert / batch-upsert / delete"],
            ["System", "Site settings, API keys, logs, and storage config"],
          ].map(([title, text]) => (
            <article
              key={title}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
