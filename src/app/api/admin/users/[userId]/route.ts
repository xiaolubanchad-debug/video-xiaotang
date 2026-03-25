import { NextResponse } from "next/server";

import { requireSuperAdminApiSession } from "@/lib/admin-auth";
import { deleteUserFromAdmin } from "@/lib/admin-users";

type Context = {
  params: Promise<{
    userId: string;
  }>;
};

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await requireSuperAdminApiSession();
    const { userId } = await context.params;

    const result = await deleteUserFromAdmin(userId, session.user.id);

    return NextResponse.json({
      ok: true,
      userId,
      email: result.email,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown admin user error";

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
