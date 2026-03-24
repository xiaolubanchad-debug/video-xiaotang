import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07111b_0%,#020406_100%)] px-6 py-12 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            Admin Access
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl leading-none">
            Super admin access
          </h1>
          <p className="max-w-xl text-base leading-8 text-slate-300">
            This backend is intentionally limited to a single super-admin
            account. Video creation, deletion, and batch ingest are designed to
            be driven by OpenClaw through protected internal APIs.
          </p>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            <p>Default workflow:</p>
            <p>1. The super admin curates and corrects content manually.</p>
            <p>2. OpenClaw pushes live ingest payloads into internal APIs.</p>
            <p>3. The system deduplicates by source ID and records ingest logs.</p>
          </div>
        </section>

        <AdminLoginForm />
      </div>
    </main>
  );
}
