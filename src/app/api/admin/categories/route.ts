import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { createCategoryFromAdmin } from "@/lib/admin-taxonomies";
import { adminCategorySchema } from "@/lib/validations/admin-category";

export async function POST(request: Request) {
  try {
    const session = await requireSuperAdminApiSession();
    const json = await request.json();
    const payload = adminCategorySchema.parse(json);

    const category = await createCategoryFromAdmin(payload, session.user.id);

    return NextResponse.json({
      ok: true,
      categoryId: category.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin category error";

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
