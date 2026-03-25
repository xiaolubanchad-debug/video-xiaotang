"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  videoId: string;
  viewer?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export function VideoCommentForm({ videoId, viewer }: Props) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!viewer) {
      setError("请先登录后再发表评论。");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/videos/${videoId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "评论提交失败，请稍后再试。");
      setIsSubmitting(false);
      return;
    }

    setContent("");
    setSuccess("评论已提交，等待后台审核后会出现在前台。");
    setIsSubmitting(false);
  }

  if (!viewer) {
    return (
      <div className="mt-6 rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-sm leading-7 text-[#b8b6bf]">
        登录后就可以发表评论。当前评论采用“先提交、后审核”的方式展示到前台。
        <div className="mt-4">
          <Link
            href="/login"
            className="inline-flex rounded-full border border-[#b8c4ff]/20 bg-[#b8c4ff]/10 px-4 py-2 text-sm font-semibold text-[#dde1ff] transition hover:bg-[#b8c4ff]/20"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-[22px] border border-white/6 bg-[#1d1d1d] px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {viewer.name || viewer.email || "当前用户"}
          </p>
          <p className="mt-1 text-xs text-[#8f8d97]">发表评论后需要后台审核通过</p>
        </div>
        <span className="rounded-full border border-white/8 px-3 py-1 text-xs text-[#c8c6cf]">
          {content.length} / 500
        </span>
      </div>

      <textarea
        rows={5}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="写下你对这部影片的观感..."
        className="mt-4 w-full rounded-[18px] border border-white/8 bg-[#111111] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-[#6f6d77]"
        maxLength={500}
        required
      />

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-full bg-[#b8c4ff] px-5 py-3 text-sm font-semibold text-[#132977] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "提交中..." : "提交评论"}
      </button>
    </form>
  );
}
