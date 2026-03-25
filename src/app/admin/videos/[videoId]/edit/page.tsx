import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminVideoForm } from "@/components/admin/admin-video-form";
import { requireSuperAdminPageSession } from "@/lib/admin-auth";
import { getVideoForAdmin } from "@/lib/admin-videos";

type PageProps = {
  params: Promise<{
    videoId: string;
  }>;
};

export default async function EditAdminVideoPage({ params }: PageProps) {
  const session = await requireSuperAdminPageSession();

  const { videoId } = await params;
  const video = await getVideoForAdmin(videoId);

  if (!video) {
    notFound();
  }

  return (
    <AdminShell
      section="videos"
      userEmail={session.user.email}
      eyebrow="内容修正"
      title="编辑视频"
      description="更新标题、封面、来源、标签和发布时间等信息，修正采集后的字段错误。"
      actions={
        <Link
          href="/admin/videos"
          className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
        >
          返回视频列表
        </Link>
      }
    >
      <AdminVideoForm
        apiEndpoint={`/api/admin/videos/${video.id}`}
        method="PUT"
        submitLabel="保存修改"
        initialValues={{
          title: video.title,
          subtitle: video.subtitle ?? "",
          description: video.description ?? "",
          coverUrl: video.coverUrl ?? "",
          posterUrl: video.posterUrl ?? "",
          trailerUrl: video.trailerUrl ?? "",
          sourceUrl: video.sources[0]?.sourceUrl ?? "",
          type: video.type,
          categoryName: video.category?.name ?? "",
          region: video.region ?? "",
          language: video.language ?? "",
          year: video.year,
          durationSeconds: video.durationSeconds,
          status: video.status,
          tags: video.tags.map((item) => item.tag.name),
        }}
      />
    </AdminShell>
  );
}
