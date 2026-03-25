import { CommentStatus, VideoStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteCommentSchema } from "@/lib/validations/site-comment";

type Context = {
  params: Promise<{
    videoId: string;
  }>;
};

export async function POST(request: Request, context: Context) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "请先登录后再发表评论。",
        },
        {
          status: 401,
        },
      );
    }

    const { videoId } = await context.params;
    const json = await request.json();
    const payload = siteCommentSchema.parse(json);

    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        status: VideoStatus.PUBLISHED,
      },
      select: {
        id: true,
      },
    });

    if (!video) {
      return NextResponse.json(
        {
          ok: false,
          error: "当前视频不存在或尚未发布。",
        },
        {
          status: 404,
        },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        videoId,
        userId: session.user.id,
        content: payload.content,
        status: CommentStatus.PENDING,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({
      ok: true,
      commentId: comment.id,
      status: comment.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown comment submit error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}
