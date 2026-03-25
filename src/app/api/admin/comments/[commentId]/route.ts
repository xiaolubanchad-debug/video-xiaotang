import { NextResponse } from "next/server";

import {
  deleteCommentFromAdmin,
  updateCommentStatusFromAdmin,
} from "@/lib/admin-comments";
import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { adminCommentStatusSchema } from "@/lib/validations/admin-comment";

type Context = {
  params: Promise<{
    commentId: string;
  }>;
};

export async function PUT(request: Request, context: Context) {
  try {
    const session = await requireSuperAdminApiSession();
    const { commentId } = await context.params;
    const json = await request.json();
    const payload = adminCommentStatusSchema.parse(json);

    const comment = await updateCommentStatusFromAdmin(
      commentId,
      payload,
      session.user.id,
    );

    return NextResponse.json({
      ok: true,
      commentId: comment.id,
      status: comment.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin comment error";

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
    const session = await requireSuperAdminApiSession();
    const { commentId } = await context.params;

    await deleteCommentFromAdmin(commentId, session.user.id);

    return NextResponse.json({
      ok: true,
      commentId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin comment error";

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
