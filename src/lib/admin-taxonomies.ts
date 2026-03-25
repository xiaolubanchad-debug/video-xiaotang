import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { type AdminCategoryInput } from "@/lib/validations/admin-category";
import { type AdminTagInput } from "@/lib/validations/admin-tag";

async function buildUniqueCategorySlug(name: string, currentCategoryId?: string) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === currentCategoryId) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

async function buildUniqueTagSlug(name: string, currentTagId?: string) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.tag.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === currentTagId) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function createCategoryFromAdmin(
  input: AdminCategoryInput,
  userId: string,
) {
  const slug = await buildUniqueCategorySlug(input.name);

  const category = await prisma.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description || null,
      sortOrder: input.sortOrder,
      status: input.status,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "CREATE",
      module: "category",
      targetId: category.id,
      detail: {
        name: category.name,
        slug: category.slug,
      },
    },
  });

  return category;
}

export async function updateCategoryFromAdmin(
  categoryId: string,
  input: AdminCategoryInput,
  userId: string,
) {
  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("Category not found.");
  }

  const slug = await buildUniqueCategorySlug(input.name, categoryId);

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: input.name,
      slug,
      description: input.description || null,
      sortOrder: input.sortOrder,
      status: input.status,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "UPDATE",
      module: "category",
      targetId: category.id,
      detail: {
        name: category.name,
        slug: category.slug,
      },
    },
  });

  return category;
}

export async function deleteCategoryFromAdmin(categoryId: string, userId: string) {
  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: {
          videos: true,
          children: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Category not found.");
  }

  if (existing._count.videos > 0 || existing._count.children > 0) {
    throw new Error("Category is in use and cannot be deleted.");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "DELETE",
      module: "category",
      targetId: categoryId,
      detail: {
        name: existing.name,
      },
    },
  });

  return existing;
}

export async function createTagFromAdmin(input: AdminTagInput, userId: string) {
  const slug = await buildUniqueTagSlug(input.name);

  const tag = await prisma.tag.create({
    data: {
      name: input.name,
      slug,
      color: input.color || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "CREATE",
      module: "tag",
      targetId: tag.id,
      detail: {
        name: tag.name,
        slug: tag.slug,
      },
    },
  });

  return tag;
}

export async function updateTagFromAdmin(
  tagId: string,
  input: AdminTagInput,
  userId: string,
) {
  const existing = await prisma.tag.findUnique({
    where: { id: tagId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("Tag not found.");
  }

  const slug = await buildUniqueTagSlug(input.name, tagId);

  const tag = await prisma.tag.update({
    where: { id: tagId },
    data: {
      name: input.name,
      slug,
      color: input.color || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "UPDATE",
      module: "tag",
      targetId: tag.id,
      detail: {
        name: tag.name,
        slug: tag.slug,
      },
    },
  });

  return tag;
}

export async function deleteTagFromAdmin(tagId: string, userId: string) {
  const existing = await prisma.tag.findUnique({
    where: { id: tagId },
    include: {
      _count: {
        select: {
          videos: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Tag not found.");
  }

  if (existing._count.videos > 0) {
    throw new Error("Tag is in use and cannot be deleted.");
  }

  await prisma.tag.delete({
    where: { id: tagId },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "DELETE",
      module: "tag",
      targetId: tagId,
      detail: {
        name: existing.name,
      },
    },
  });

  return existing;
}
