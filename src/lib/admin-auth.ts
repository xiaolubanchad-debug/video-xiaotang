import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export async function getSuperAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isSuperAdmin) {
    return null;
  }

  return session;
}

export async function requireSuperAdminPageSession() {
  const session = await getSuperAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireSuperAdminApiSession() {
  const session = await getSuperAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
