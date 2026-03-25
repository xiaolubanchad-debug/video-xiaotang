import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { siteRegisterSchema } from "@/lib/validations/site-auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = siteRegisterSchema.parse(json);

    const existing = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "这个邮箱已经注册过了，请直接登录。",
        },
        {
          status: 400,
        },
      );
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const fallbackNickname = payload.email.split("@")[0];

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        nickname: payload.nickname ?? fallbackNickname,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return NextResponse.json({
      ok: true,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown register error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}
