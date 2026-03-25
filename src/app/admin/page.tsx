import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  const quickLinks = [
    {
      href: "/admin/videos",
      label: "Open videos",
      kind: "secondary" as const,
    },
    {
      href: "/admin/categories",
      label: "Open categories",
      kind: "secondary" as const,
    },
    {
      href: "/admin/tags",
      label: "Open tags",
      kind: "secondary" as const,
    },
    {
      href: "/admin/ingest-logs",
      label: "Open ingest logs",
      kind: "secondary" as const,
    },
    {
      href: "/admin/login",
      label: "Admin login",
      kind: "primary" as const,
    },
  ];

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
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.kind === "primary"
                    ? "rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                    : "rounded-full border border-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/8"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            [
              "Video Ops",
              "Create, edit, archive, delete, and track source links.",
              "/admin/videos",
            ],
            [
              "Categories",
              "Control the navigation rows that feed the public site.",
              "/admin/categories",
            ],
            [
              "Tags",
              "Maintain reusable search and discovery labels for videos.",
              "/admin/tags",
            ],
            [
              "Ingest Logs",
              "Inspect upsert, batch-upsert, and delete calls from OpenClaw.",
              "/admin/ingest-logs",
            ],
            [
              "System",
              "Leave room for settings, API keys, and deeper operator tooling.",
              "/admin",
            ],
          ].map(([title, text, href]) => (
            <article
              key={title}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              <Link
                href={href}
                className="mt-4 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/8"
              >
                Open
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
