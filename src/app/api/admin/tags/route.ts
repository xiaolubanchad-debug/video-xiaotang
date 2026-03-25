import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { createTagFromAdmin } from "@/lib/admin-taxonomies";
import { adminTagSchema } from "@/lib/validations/admin-tag";

export async function POST(request: Request) {
  try {
    const session = await requireSuperAdminApiSession();
    const json = await request.json();
    const payload = adminTagSchema.parse(json);

    const tag = await createTagFromAdmin(payload, session.user.id);

    return NextResponse.json({
      ok: true,
      tagId: tag.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin tag error";

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
