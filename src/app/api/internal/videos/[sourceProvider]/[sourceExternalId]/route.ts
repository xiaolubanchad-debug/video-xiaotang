import { NextResponse } from "next/server";

import { deleteVideoFromIngest } from "@/lib/video-ingest";
import { requireInternalApiKey } from "@/lib/internal-api";

type RouteContext = {
  params: Promise<{
    sourceProvider: string;
    sourceExternalId: string;
  }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  try {
    requireInternalApiKey(request);

    const params = await context.params;
    const deleted = await deleteVideoFromIngest(
      params.sourceProvider,
      params.sourceExternalId,
    );

    return NextResponse.json({
      ok: true,
      action: "delete",
      deleted,
      sourceProvider: params.sourceProvider,
      sourceExternalId: params.sourceExternalId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown delete error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 },
    );
  }
}
