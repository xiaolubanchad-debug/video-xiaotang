"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  userId: string;
  email: string;
};

export function AdminUserDeleteButton({ userId, email }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `确定删除用户“${email}”吗？这会同时删除他的评论、收藏、最近观看和搜索记录。`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !result.ok) {
      setIsDeleting(false);
      window.alert(result.error ?? "删除失败，请稍后重试。");
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "删除中..." : "删除用户"}
    </button>
  );
}
