import { NextResponse } from "next/server";

import { requireInternalApiKey } from "@/lib/internal-api";
import { upsertVideoFromIngest } from "@/lib/video-ingest";
import { videoIngestSchema } from "@/lib/validations/video-ingest";

export async function POST(request: Request) {
  try {
    requireInternalApiKey(request);

    const json = await request.json();
    const payload = videoIngestSchema.parse(json);
    const video = await upsertVideoFromIngest(payload);

    return NextResponse.json({
      ok: true,
      action: "upsert",
      videoId: video.id,
      sourceProvider: video.sourceProvider,
      sourceExternalId: video.sourceExternalId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown ingest error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 },
    );
  }
}
