import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { createVideoFromAdmin } from "@/lib/admin-videos";
import { adminVideoSchema } from "@/lib/validations/admin-video";

export async function POST(request: Request) {
  try {
    const session = await requireSuperAdminApiSession();
    const json = await request.json();
    const payload = adminVideoSchema.parse(json);

    const video = await createVideoFromAdmin(payload, session.user.id);

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
