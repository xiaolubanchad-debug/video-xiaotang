import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07111b_0%,#020406_100%)] px-6 py-12 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            后台登录
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl leading-none">
            超级管理员入口
          </h1>
          <p className="max-w-xl text-base leading-8 text-slate-300">
            这个后台故意只保留一个超级管理员账号。视频新增、删除和批量采集，都会通过这个运营入口和 OpenClaw 的内部 API 完成闭环。
          </p>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            <p>默认工作流：</p>
            <p>1. 超级管理员手动修正与补录内容。</p>
            <p>2. OpenClaw 把实时采集结果推送到内部 API。</p>
            <p>3. 系统根据来源 ID 去重，并记录 ingest 日志。</p>
          </div>
        </section>

        <AdminLoginForm />
      </div>
    </main>
  );
}
