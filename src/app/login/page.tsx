import { redirect } from "next/navigation";

import { SiteAuthPanel } from "@/components/site/site-auth-panel";
import { SiteShell } from "@/components/site/site-shell";
import { getViewerSession } from "@/lib/auth";
import { getSiteNavigationCategories } from "@/lib/site-videos";

export default async function LoginPage() {
  const [session, categories] = await Promise.all([
    getViewerSession(),
    getSiteNavigationCategories(),
  ]);

  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <SiteShell categories={categories} activeNav="discover">
      <div className="mx-auto grid min-h-[calc(100vh-14rem)] max-w-6xl items-center gap-10 py-8 lg:grid-cols-[1fr_1fr]">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">
            站点账号体系
          </p>
          <h1 className="font-serif text-5xl leading-none text-white sm:text-6xl">
            登录后参与影片讨论
          </h1>
          <p className="max-w-xl text-base leading-8 text-slate-300">
            这一版先开放基础用户登录与评论发布。你可以注册普通观众账号，在视频详情页提交评论，后台审核通过后就会展示在前台。
          </p>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            <p>当前开放能力：</p>
            <p>1. 邮箱注册和密码登录。</p>
            <p>2. 视频详情页发表评论。</p>
            <p>3. 评论进入后台待审核队列。</p>
          </div>
        </section>

        <SiteAuthPanel />
      </div>
    </SiteShell>
  );
}
