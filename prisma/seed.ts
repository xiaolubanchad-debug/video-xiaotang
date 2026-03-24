import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("Skip seeding: SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is missing.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isSuperAdmin: true,
      status: "ACTIVE",
    },
    create: {
      email,
      nickname: "Super Admin",
      passwordHash,
      isSuperAdmin: true,
      status: "ACTIVE",
    },
  });

  console.log(`Super admin ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
