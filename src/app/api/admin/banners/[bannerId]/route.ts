import { NextResponse } from "next/server";

import {
  deleteBannerFromAdmin,
  updateBannerFromAdmin,
} from "@/lib/admin-banners";
import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { adminBannerSchema } from "@/lib/validations/admin-banner";

type Context = {
  params: Promise<{
    bannerId: string;
  }>;
};

export async function PUT(request: Request, context: Context) {
  try {
    const session = await requireSuperAdminApiSession();
    const { bannerId } = await context.params;
    const json = await request.json();
    const payload = adminBannerSchema.parse(json);

    const banner = await updateBannerFromAdmin(bannerId, payload, session.user.id);

    return NextResponse.json({
      ok: true,
      bannerId: banner.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin banner error";

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
    const { bannerId } = await context.params;

    await deleteBannerFromAdmin(bannerId, session.user.id);

    return NextResponse.json({
      ok: true,
      bannerId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin banner error";

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
