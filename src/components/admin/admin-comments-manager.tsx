"use client";

import Link from "next/link";
import { CommentStatus } from "@prisma/client";
import { useMemo, useState } from "react";

type CommentItem = {
  id: string;
  content: string;
  status: CommentStatus;
  likeCount: number;
  createdAtLabel: string;
  updatedAtLabel: string;
  userLabel: string;
  videoTitle: string;
  videoSlug: string;
  parentSummary: string | null;
};

type Props = {
  comments: CommentItem[];
};

export function AdminCommentsManager({ comments }: Props) {
  const [items, setItems] = useState(comments);
  const [error, setError] = useState<string | null>(null);
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      pending: items.filter((item) => item.status === CommentStatus.PENDING).length,
      approved: items.filter((item) => item.status === CommentStatus.APPROVED).length,
      hidden: items.filter((item) => item.status === CommentStatus.HIDDEN).length,
    }),
    [items],
  );

  async function handleStatusUpdate(commentId: string, status: CommentStatus) {
    setPendingActionKey(`${commentId}:${status}`);
    setError(null);

    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "更新评论状态失败。");
      setPendingActionKey(null);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === commentId
          ? {
              ...item,
              status,
              updatedAtLabel: "刚刚更新",
            }
          : item,
      ),
    );
    setPendingActionKey(null);
  }

  async function handleDelete(commentId: string) {
    setPendingActionKey(`${commentId}:delete`);
    setError(null);

    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "删除评论失败。");
      setPendingActionKey(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== commentId));
    setPendingActionKey(null);
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="待审核" value={stats.pending} />
        <StatCard label="已通过" value={stats.approved} />
        <StatCard label="已隐藏" value={stats.hidden} />
      </section>

      {error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <section className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm leading-7 text-slate-300">
            当前还没有评论数据。等后续接入前台发布后，这里会显示需要审核或已经展示的评论。
          </div>
        ) : (
          items.map((item) => {
            const approveKey = `${item.id}:${CommentStatus.APPROVED}`;
            const hideKey = `${item.id}:${CommentStatus.HIDDEN}`;
            const deleteKey = `${item.id}:delete`;

            return (
              <article
                key={item.id}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-white">{item.userLabel}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-slate-300">
                      所属视频：
                      <Link
                        href={`/videos/${item.videoSlug}`}
                        className="ml-2 text-cyan-200 transition hover:text-cyan-100"
                      >
                        {item.videoTitle}
                      </Link>
                    </p>
                    <p className="text-xs text-slate-400">
                      创建于 {item.createdAtLabel} · 最近更新 {item.updatedAtLabel}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.status !== CommentStatus.APPROVED ? (
                      <button
                        type="button"
                        onClick={() => void handleStatusUpdate(item.id, CommentStatus.APPROVED)}
                        disabled={pendingActionKey === approveKey}
                        className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pendingActionKey === approveKey ? "提交中..." : "审核通过"}
                      </button>
                    ) : null}
                    {item.status !== CommentStatus.HIDDEN ? (
                      <button
                        type="button"
                        onClick={() => void handleStatusUpdate(item.id, CommentStatus.HIDDEN)}
                        disabled={pendingActionKey === hideKey}
                        className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pendingActionKey === hideKey ? "提交中..." : "隐藏评论"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void handleDelete(item.id)}
                      disabled={pendingActionKey === deleteKey}
                      className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingActionKey === deleteKey ? "删除中..." : "删除"}
                    </button>
                  </div>
                </div>

                {item.parentSummary ? (
                  <div className="mt-5 rounded-[20px] border border-white/8 bg-[#111827]/35 px-4 py-4 text-sm text-slate-300">
                    回复对象：{item.parentSummary}
                  </div>
                ) : null}

                <p className="mt-5 text-sm leading-8 text-slate-100">{item.content}</p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4 text-xs text-slate-400">
                  <span>点赞数：{item.likeCount}</span>
                  <Link
                    href={`/videos/${item.videoSlug}`}
                    className="text-cyan-200 transition hover:text-cyan-100"
                  >
                    前台查看此视频
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </article>
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
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}
