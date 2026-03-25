"use client";

import { CommentStatus } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

type CommentItem = {
  id: string;
  content: string;
  status: CommentStatus;
  likeCount: number;
  createdAtLabel: string;
  videoTitle: string;
  videoSlug: string;
};

type Props = {
  comments: CommentItem[];
};

export function MyCommentList({ comments }: Props) {
  const [items, setItems] = useState(comments);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(commentId: string) {
    setPendingDeleteId(commentId);
    setError(null);

    const response = await fetch(`/api/me/comments/${commentId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "删除评论失败，请稍后再试。");
      setPendingDeleteId(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== commentId));
    setPendingDeleteId(null);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm leading-7 text-slate-300">
        你还没有发布过评论。去任意视频详情页写下第一条观影短评吧。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {items.map((comment) => (
        <article
          key={comment.id}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <StatusBadge status={comment.status} />
              <p className="text-sm text-slate-300">
                关联视频：
                <Link
                  href={`/videos/${comment.videoSlug}`}
                  className="ml-2 text-cyan-200 transition hover:text-cyan-100"
                >
                  {comment.videoTitle}
                </Link>
              </p>
              <p className="text-xs text-slate-400">{comment.createdAtLabel}</p>
            </div>

            {comment.status === CommentStatus.PENDING ? (
              <button
                type="button"
                onClick={() => void handleDelete(comment.id)}
                disabled={pendingDeleteId === comment.id}
                className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingDeleteId === comment.id ? "删除中..." : "删除待审核评论"}
              </button>
            ) : (
              <span className="rounded-full border border-white/8 px-3 py-1 text-xs text-slate-300">
                点赞数：{comment.likeCount}
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-8 text-white">{comment.content}</p>
        </article>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: CommentStatus }) {
  const styles =
    status === CommentStatus.APPROVED
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
      : status === CommentStatus.HIDDEN
        ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
        : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

  const label =
    status === CommentStatus.APPROVED
      ? "已通过"
      : status === CommentStatus.HIDDEN
        ? "已隐藏"
        : "待审核";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}
