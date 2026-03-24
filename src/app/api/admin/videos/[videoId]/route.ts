import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { deleteVideoFromAdmin, updateVideoFromAdmin } from "@/lib/admin-videos";
import { adminVideoSchema } from "@/lib/validations/admin-video";

type RouteContext = {
  params: Promise<{
    videoId: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireSuperAdminApiSession();
    const params = await context.params;
    const json = await request.json();
    const payload = adminVideoSchema.parse(json);

    const video = await updateVideoFromAdmin(
      params.videoId,
      payload,
      session.user.id,
    );

    return NextResponse.json({
      ok: true,
      videoId: video.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin video error";

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

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSuperAdminApiSession();
    const params = await context.params;

    const deleted = await deleteVideoFromAdmin(params.videoId, session.user.id);

    return NextResponse.json({
      ok: true,
      deletedId: deleted.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin video error";

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
