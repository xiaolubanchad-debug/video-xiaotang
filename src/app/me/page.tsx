import { MeNav } from "@/components/site/me-nav";
import { SiteShell } from "@/components/site/site-shell";
import { requireViewerPageSession } from "@/lib/auth";
import { getSiteNavigationCategories } from "@/lib/site-videos";
import { getViewerCenterSummary } from "@/lib/site-account";

export default async function MePage() {
  const session = await requireViewerPageSession();
  const [categories, summary] = await Promise.all([
    getSiteNavigationCategories(),
    getViewerCenterSummary(session.user.id),
  ]);

  return (
    <SiteShell categories={categories} activeNav="discover" viewer={session.user}>
      <div className="space-y-8">
        <section className="space-y-6 rounded-[30px] border border-white/6 bg-[#151515] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:px-8">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.35em] text-[#8f8d97]">我的中心</p>
            <h1 className="font-serif text-5xl text-white sm:text-6xl">
              {session.user.name || session.user.email}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[#b6b4bc]">
              这里收纳你在站内的评论和收藏。当前版本先做最核心的个人互动能力，后续再接入观看历史和更多偏好设置。
            </p>
          </div>

          <MeNav activeHref="/me" />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="我的收藏" value={summary.favoriteCount} />
          <StatCard label="我的评论" value={summary.commentCount} />
          <StatCard label="待审核评论" value={summary.pendingCommentCount} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs tracking-[0.35em] text-[#8f8d97]">账号信息</p>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <p>邮箱：{session.user.email}</p>
              <p>昵称：{session.user.name || "未设置昵称"}</p>
              <p>当前角色：普通观众账号</p>
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs tracking-[0.35em] text-[#8f8d97]">下一步推荐</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>1. 在视频详情页收藏你想稍后再看的内容。</p>
              <p>2. 提交评论后，可在“我的评论”里查看审核状态。</p>
              <p>3. 通过首页和搜索继续探索片库。</p>
            </div>
          </article>
        </section>
      </div>
    </SiteShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <p className="text-xs tracking-[0.35em] text-[#8f8d97]">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </article>
  );
}
