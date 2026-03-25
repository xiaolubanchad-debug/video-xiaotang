"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
  viewer?: {
    name?: string | null;
    email?: string | null;
    isSuperAdmin?: boolean;
  } | null;
};

export function SiteAuthActions({ viewer }: Props) {
  if (!viewer) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-white/8 bg-[linear-gradient(145deg,#282828,#181818)] px-4 py-2 text-sm font-semibold text-[#ffb4aa] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition hover:border-[#ffb4aa]/30"
      >
        登录
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white sm:block">
        {viewer.name || viewer.email || "已登录用户"}
      </div>
      <Link
        href="/me"
        className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        我的
      </Link>
      {viewer.isSuperAdmin ? (
        <Link
          href="/admin"
          className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
        >
          后台
        </Link>
      ) : null}
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        退出
      </button>
    </div>
  );
}
