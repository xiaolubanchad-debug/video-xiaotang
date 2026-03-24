export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#15314a_0%,#09111a_40%,#04070b_100%)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(239,68,68,0.12),transparent_30%,rgba(56,189,248,0.1)_70%,transparent)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
              video-xiaotang
            </p>
            <p className="text-sm text-white/70">
              Video CMS skeleton with ingest APIs
            </p>
          </div>
          <a
            href="/admin"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
          >
            Open admin
          </a>
        </header>

        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-200/10 px-4 py-2 text-sm text-amber-100">
              MVP is ready for implementation
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-[family-name:var(--font-cormorant)] text-5xl leading-none tracking-tight sm:text-6xl lg:text-7xl">
                A video platform with a public site, a super-admin CMS, and
                OpenClaw ingest hooks.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/72">
                This scaffold already includes the public landing page, the
                super-admin area, Prisma data models, and the internal content
                APIs that <span className="text-cyan-200">openclaw</span> can
                call to create, update, and delete video records.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="/admin"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                Enter admin
              </a>
              <a
                href="/admin/login"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
              >
                Admin sign in
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              ["Public Site", "Home, browse, search, and detail-page shell"],
              ["Admin CMS", "Single super-admin operations console"],
              ["Internal APIs", "openclaw upsert / batch / delete"],
              ["Prisma Models", "Videos, tags, categories, and ingest logs"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
                  {title}
                </p>
                <p className="mt-3 text-base leading-7 text-white/80">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
