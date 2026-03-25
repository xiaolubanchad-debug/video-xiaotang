import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { updateHomeSectionsFromAdmin } from "@/lib/admin-home-sections";
import { adminHomeSectionsSchema } from "@/lib/validations/admin-home-sections";

export async function PUT(request: Request) {
  try {
    const session = await requireSuperAdminApiSession();
    const json = await request.json();
    const payload = adminHomeSectionsSchema.parse(json);

    await updateHomeSectionsFromAdmin(payload, session.user.id);

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin home sections error";

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
