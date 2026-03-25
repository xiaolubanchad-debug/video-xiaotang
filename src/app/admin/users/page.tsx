import { AdminShell } from "@/components/admin/admin-shell";
import { AdminUserDeleteButton } from "@/components/admin/admin-user-delete-button";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { listUsersForAdmin } from "@/lib/admin-users";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await requireSuperAdminPageSession();
  const params = await searchParams;
  const { users, filters, stats } = await listUsersForAdmin(params);

  return (
    <AdminShell
      section="users"
      userEmail={session.user.email}
      eyebrow="用户管理"
      title="用户管理"
      description="按邮箱检索普通用户，并在需要时直接删除该用户及其评论、收藏、最近观看和搜索记录。"
    >
      <section className="grid gap-4 md:grid-cols-2">
        <StatCard label="普通用户总数" value={stats.totalUsers} />
        <StatCard label="当前筛选结果" value={stats.filteredUsers} />
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <form className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="flex-1 space-y-2">
            <span className="text-sm text-slate-300">按邮箱搜索</span>
            <input
              name="email"
              defaultValue={filters.email}
              placeholder="例如：user@example.com"
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="h-12 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              搜索用户
            </button>
            <a
              href="/admin/users"
              className="inline-flex h-12 items-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              清空筛选
            </a>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[1.5fr_0.9fr_0.9fr_0.9fr_0.9fr_1fr_0.9fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 xl:grid">
          <p>用户</p>
          <p>评论</p>
          <p>收藏</p>
          <p>最近观看</p>
          <p>搜索记录</p>
          <p>注册时间</p>
          <p>操作</p>
        </div>

        <div className="divide-y divide-white/10">
          {users.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-300">
              当前筛选条件下没有用户。你可以调整邮箱关键词，或者等待前台有新的注册用户。
            </div>
          ) : (
            users.map((user) => (
              <article
                key={user.id}
                className="grid grid-cols-1 gap-4 px-6 py-5 xl:grid-cols-[1.5fr_0.9fr_0.9fr_0.9fr_0.9fr_1fr_0.9fr]"
              >
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                    用户
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {user.nickname || "未设置昵称"}
                  </h2>
                  <p className="text-sm text-slate-300">{user.email}</p>
                </div>

                <Cell label="评论" value={String(user._count.comments)} />
                <Cell label="收藏" value={String(user._count.favorites)} />
                <Cell label="最近观看" value={String(user._count.watchHistories)} />
                <Cell label="搜索记录" value={String(user._count.searches)} />
                <Cell label="注册时间" value={user.createdAt.toLocaleString("zh-CN")} />

                <div className="flex flex-wrap items-start gap-2">
                  <p className="w-full text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">
                    操作
                  </p>
                  <AdminUserDeleteButton userId={user.id} email={user.email} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-medium text-cyan-100/80">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </article>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm text-slate-300">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 xl:hidden">{label}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  );
}
