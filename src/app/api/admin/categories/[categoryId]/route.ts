import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import {
  deleteCategoryFromAdmin,
  updateCategoryFromAdmin,
} from "@/lib/admin-taxonomies";
import { adminCategorySchema } from "@/lib/validations/admin-category";

type RouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireSuperAdminApiSession();
    const params = await context.params;
    const json = await request.json();
    const payload = adminCategorySchema.parse(json);

    const category = await updateCategoryFromAdmin(
      params.categoryId,
      payload,
      session.user.id,
    );

    return NextResponse.json({
      ok: true,
      categoryId: category.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown category update error";

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
    await deleteCategoryFromAdmin(params.categoryId, session.user.id);

    return NextResponse.json({
      ok: true,
      categoryId: params.categoryId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown category delete error";

    return NextResponse.json(
      { ok: false, error: message },
      { status: message === "Unauthorized" ? 401 : 400 },
    );
  }
}
