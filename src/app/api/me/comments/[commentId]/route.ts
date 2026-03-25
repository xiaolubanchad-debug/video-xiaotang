import { NextResponse } from "next/server";

import { requireViewerApiSession } from "@/lib/auth";
import { deletePendingCommentForViewer } from "@/lib/site-account";

type Context = {
  params: Promise<{
    commentId: string;
  }>;
};

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await requireViewerApiSession();
    const { commentId } = await context.params;

    await deletePendingCommentForViewer(session.user.id, commentId);

    return NextResponse.json({
      ok: true,
      commentId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown my-comment delete error";

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
