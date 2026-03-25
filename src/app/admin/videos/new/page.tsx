import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminVideoForm } from "@/components/admin/admin-video-form";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";

export default async function NewAdminVideoPage() {
  const session = await requireSuperAdminPageSession();

  return (
    <AdminShell
      section="videos"
      userEmail={session.user.email}
      eyebrow="手动录入"
      title="新增视频"
      description="用于运营补录、采集纠偏和手动发布。OpenClaw 仍然可以通过内部 ingest API 自动入库，但这里保留人工可控的编辑入口。"
      actions={
        <Link
          href="/admin/videos"
          className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
        >
          返回视频列表
        </Link>
      }
    >
      <AdminVideoForm />
    </AdminShell>
  );
}
