import { AdminCommentsManager } from "@/components/admin/admin-comments-manager";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { listCommentsForAdmin } from "@/lib/admin-comments";

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function AdminCommentsPage() {
  const session = await requireSuperAdminPageSession();
  const comments = await listCommentsForAdmin();

  return (
    <AdminShell
      section="comments"
      userEmail={session.user.email}
      eyebrow="评论审核"
      title="评论管理"
      description="先把评论审核链路跑通。当前前台仍不开放评论发布，但这里已经可以查看、通过、隐藏和删除已有评论数据。"
    >
      <AdminCommentsManager
        comments={comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          status: comment.status,
          likeCount: comment.likeCount,
          createdAtLabel: formatDateLabel(comment.createdAt),
          updatedAtLabel: formatDateLabel(comment.updatedAt),
          userLabel: comment.user.nickname || comment.user.email || "匿名用户",
          videoTitle: comment.video.title,
          videoSlug: comment.video.slug,
          parentSummary: comment.parent
            ? `${comment.parent.user.nickname || comment.parent.user.email || "匿名用户"}：${comment.parent.content.slice(0, 36)}`
            : null,
        }))}
      />
    </AdminShell>
  );
}
