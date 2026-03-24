import { NextResponse } from "next/server";

import { requireInternalApiKey } from "@/lib/internal-api";
import { upsertVideoFromIngest } from "@/lib/video-ingest";
import { batchVideoIngestSchema } from "@/lib/validations/video-ingest";

export async function POST(request: Request) {
  try {
    requireInternalApiKey(request);

    const json = await request.json();
    const payload = batchVideoIngestSchema.parse(json);

    const results = await Promise.allSettled(
      payload.items.map((item) => upsertVideoFromIngest(item)),
    );

    const success = results.filter((item) => item.status === "fulfilled").length;
    const failed = results.length - success;

    return NextResponse.json({
      ok: failed === 0,
      action: "batch-upsert",
      total: results.length,
      success,
      failed,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown batch ingest error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 },
    );
  }
}
