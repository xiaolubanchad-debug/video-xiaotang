import bcrypt from "bcryptjs";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { redirect } from "next/navigation";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SessionUser = DefaultSession["user"] & {
  id: string;
  isSuperAdmin: boolean;
};

async function authorizeWithPassword(
  credentials: Record<string, unknown> | undefined,
  requireSuperAdmin: boolean,
) {
  const parsed = credentialsSchema.safeParse(credentials);

  if (!parsed.success) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user?.passwordHash || (requireSuperAdmin && !user.isSuperAdmin)) {
    return null;
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.nickname ?? user.email,
    isSuperAdmin: user.isSuperAdmin,
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Super Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return authorizeWithPassword(credentials, true);
      },
    }),
    CredentialsProvider({
      id: "user-credentials",
      name: "Site User",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return authorizeWithPassword(credentials, false);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isSuperAdmin = Boolean(user.isSuperAdmin);
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user as SessionUser),
        id: token.sub ?? "",
        email: token.email,
        name: typeof token.name === "string" ? token.name : session.user.name,
        isSuperAdmin: Boolean(token.isSuperAdmin),
      };

      return session;
    },
  },
};

export async function getViewerSession() {
  return getServerSession(authOptions);
}

export async function requireViewerPageSession() {
  const session = await getViewerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

export async function requireViewerApiSession() {
  const session = await getViewerSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session;
}
