"use client";

import { useState } from "react";

type Props = {
  videoId: string;
  title: string;
};

export function AdminVideoDeleteButton({ videoId, title }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${title}"? This removes the video record from the CMS.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    const response = await fetch(`/api/admin/videos/${videoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setIsDeleting(false);
      window.alert("Delete failed. Please try again.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
