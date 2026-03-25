import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { deleteTagFromAdmin, updateTagFromAdmin } from "@/lib/admin-taxonomies";
import { adminTagSchema } from "@/lib/validations/admin-tag";

type RouteContext = {
  params: Promise<{
    tagId: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireSuperAdminApiSession();
    const params = await context.params;
    const json = await request.json();
    const payload = adminTagSchema.parse(json);

    const tag = await updateTagFromAdmin(params.tagId, payload, session.user.id);

    return NextResponse.json({
      ok: true,
      tagId: tag.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown tag update error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: message === "Unauthorized" ? 401 : 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireSuperAdminApiSession();
    const params = await context.params;
    await deleteTagFromAdmin(params.tagId, session.user.id);

    return NextResponse.json({
      ok: true,
      tagId: params.tagId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown tag delete error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: message === "Unauthorized" ? 401 : 400 },
    );
  }
}
