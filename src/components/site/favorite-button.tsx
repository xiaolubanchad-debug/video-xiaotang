"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  videoId: string;
  initialFavorited: boolean;
  initialCount: number;
  isLoggedIn: boolean;
};

export function FavoriteButton({
  videoId,
  initialFavorited,
  initialCount,
  isLoggedIn,
}: Props) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    if (!isLoggedIn) {
      setError("请先登录后再收藏。");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const nextFavorited = !isFavorited;
    const response = await fetch(`/api/videos/${videoId}/favorite`, {
      method: nextFavorited ? "POST" : "DELETE",
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.error ?? "收藏操作失败，请稍后再试。");
      setIsSubmitting(false);
      return;
    }

    setIsFavorited(nextFavorited);
    setFavoriteCount((current) => Math.max(0, current + (nextFavorited ? 1 : -1)));
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => void handleToggle()}
        disabled={isSubmitting}
        className={`w-full rounded-[18px] border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
          isFavorited
            ? "border-[#ffb4aa]/24 bg-[#ffb4aa]/10 text-[#ffd9d2]"
            : "border-[#b8c4ff]/16 bg-[#b8c4ff]/10 text-[#dbe0ff]"
        }`}
      >
        {isSubmitting
          ? "处理中..."
          : isFavorited
            ? `已收藏 · ${favoriteCount}`
            : `加入收藏 · ${favoriteCount}`}
      </button>

      {!isLoggedIn ? (
        <Link
          href="/login"
          className="block rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-white"
        >
          登录后收藏
        </Link>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
