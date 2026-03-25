import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { createBannerFromAdmin } from "@/lib/admin-banners";
import { adminBannerSchema } from "@/lib/validations/admin-banner";

export async function POST(request: Request) {
  try {
    const session = await requireSuperAdminApiSession();
    const json = await request.json();
    const payload = adminBannerSchema.parse(json);

    const banner = await createBannerFromAdmin(payload, session.user.id);

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
