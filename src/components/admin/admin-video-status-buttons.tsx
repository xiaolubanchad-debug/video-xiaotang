"use client";

import { VideoStatus } from "@prisma/client";
import { useState } from "react";

type Props = {
  videoId: string;
  status: VideoStatus;
};

const actions: Array<{
  status: VideoStatus;
  label: string;
  className: string;
}> = [
  {
    status: VideoStatus.PUBLISHED,
    label: "发布",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20",
  },
  {
    status: VideoStatus.DRAFT,
    label: "转草稿",
    className:
      "border-cyan-300/20 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20",
  },
  {
    status: VideoStatus.ARCHIVED,
    label: "归档",
    className:
      "border-amber-400/20 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20",
  },
];

export function AdminVideoStatusButtons({ videoId, status }: Props) {
  const [pendingStatus, setPendingStatus] = useState<VideoStatus | null>(null);

  async function handleStatusUpdate(nextStatus: VideoStatus) {
    setPendingStatus(nextStatus);

    const response = await fetch(`/api/admin/videos/${videoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    if (!response.ok) {
      setPendingStatus(null);
      window.alert("更新视频状态失败，请稍后再试。");
      return;
    }

    window.location.reload();
  }

  return (
    <>
      {actions
        .filter((action) => action.status !== status)
        .map((action) => (
          <button
            key={action.status}
            type="button"
            onClick={() => void handleStatusUpdate(action.status)}
            disabled={pendingStatus !== null}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
          >
            {pendingStatus === action.status ? "处理中..." : action.label}
          </button>
        ))}
    </>
  );
}
