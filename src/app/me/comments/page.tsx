import { MeNav } from "@/components/site/me-nav";
import { MyCommentList } from "@/components/site/my-comment-list";
import { SiteShell } from "@/components/site/site-shell";
import { requireViewerPageSession } from "@/lib/auth";
import { getViewerCenterSummary, listViewerComments } from "@/lib/site-account";
import { getSiteNavigationCategories } from "@/lib/site-videos";

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function MyCommentsPage() {
  const session = await requireViewerPageSession();
  const [categories, summary, comments] = await Promise.all([
    getSiteNavigationCategories(),
    getViewerCenterSummary(session.user.id),
    listViewerComments(session.user.id),
  ]);

  return (
    <SiteShell categories={categories} activeNav="discover" viewer={session.user}>
      <div className="space-y-8">
        <section className="space-y-6 rounded-[30px] border border-white/6 bg-[#151515] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.24)] sm:px-8">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.35em] text-[#8f8d97]">我的中心</p>
            <h1 className="font-serif text-5xl text-white sm:text-6xl">我的评论</h1>
            <p className="max-w-3xl text-base leading-8 text-[#b6b4bc]">
              当前共有 {summary.commentCount} 条评论，其中 {summary.pendingCommentCount} 条还在等待后台审核。待审核评论可以由你自己删除重发。
            </p>
          </div>

          <MeNav activeHref="/me/comments" />
        </section>

        <MyCommentList
          comments={comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            status: comment.status,
            likeCount: comment.likeCount,
            createdAtLabel: formatDateLabel(comment.createdAt),
            videoTitle: comment.video.title,
            videoSlug: comment.video.slug,
          }))}
        />
      </div>
    </SiteShell>
  );
}
