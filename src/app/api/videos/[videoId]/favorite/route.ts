import { VideoStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireViewerApiSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  addFavoriteForViewer,
  removeFavoriteForViewer,
} from "@/lib/site-account";

type Context = {
  params: Promise<{
    videoId: string;
  }>;
};

async function ensurePublishedVideo(videoId: string) {
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
    throw new Error("Video not found.");
  }
}

export async function POST(_request: Request, context: Context) {
  try {
    const session = await requireViewerApiSession();
    const { videoId } = await context.params;

    await ensurePublishedVideo(videoId);
    await addFavoriteForViewer(session.user.id, videoId);

    return NextResponse.json({
      ok: true,
      videoId,
      favorited: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown favorite error";

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

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await requireViewerApiSession();
    const { videoId } = await context.params;

    await removeFavoriteForViewer(session.user.id, videoId);

    return NextResponse.json({
      ok: true,
      videoId,
      favorited: false,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown favorite error";

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
