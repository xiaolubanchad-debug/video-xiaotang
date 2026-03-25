import { VideoStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireViewerApiSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordWatchHistoryForViewer } from "@/lib/site-account";

type Context = {
  params: Promise<{
    videoId: string;
  }>;
};

export async function POST(request: Request, context: Context) {
  try {
    const session = await requireViewerApiSession();
    const { videoId } = await context.params;
    const json = (await request.json()) as {
      progressSeconds?: number;
    };

    const progressSeconds =
      typeof json.progressSeconds === "number" ? json.progressSeconds : 0;

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
          error: "Video not found.",
        },
        {
          status: 404,
        },
      );
    }

    await recordWatchHistoryForViewer(session.user.id, videoId, progressSeconds);

    return NextResponse.json({
      ok: true,
      videoId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown watch history error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      {
        status: message === "Unauthorized" ? 401 : 400,
      },
    );
  }
}
