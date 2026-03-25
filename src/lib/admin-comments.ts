import { CommentStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { type AdminCommentStatusInput } from "@/lib/validations/admin-comment";

const adminCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  status: true,
  likeCount: true,
  createdAt: true,
  updatedAt: true,
  parentId: true,
  user: {
    select: {
      email: true,
      nickname: true,
    },
  },
  video: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  parent: {
    select: {
      content: true,
      user: {
        select: {
          nickname: true,
          email: true,
        },
      },
    },
  },
});

export type AdminCommentItem = Prisma.CommentGetPayload<{
  select: typeof adminCommentSelect;
}>;

async function syncVideoCommentCount(videoId: string) {
  const approvedCount = await prisma.comment.count({
    where: {
      videoId,
      status: CommentStatus.APPROVED,
    },
  });

  await prisma.video.update({
    where: {
      id: videoId,
    },
    data: {
      commentCount: approvedCount,
    },
  });
}

export async function listCommentsForAdmin() {
  return prisma.comment.findMany({
    orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
    select: adminCommentSelect,
    take: 80,
  });
}

export async function updateCommentStatusFromAdmin(
  commentId: string,
  input: AdminCommentStatusInput,
  userId: string,
) {
  const existing = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      videoId: true,
      status: true,
      content: true,
    },
  });

  if (!existing) {
    throw new Error("Comment not found.");
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: input.status,
    },
    select: adminCommentSelect,
  });

  await syncVideoCommentCount(existing.videoId);

  await prisma.auditLog.create({
    data: {
      userId,
      action: "UPDATE",
      module: "comment",
      targetId: commentId,
      detail: {
        fromStatus: existing.status,
        toStatus: input.status,
        preview: existing.content.slice(0, 80),
      },
    },
  });

  return updatedComment;
}

export async function deleteCommentFromAdmin(commentId: string, userId: string) {
  const existing = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      videoId: true,
      content: true,
    },
  });

  if (!existing) {
    throw new Error("Comment not found.");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  await syncVideoCommentCount(existing.videoId);

  await prisma.auditLog.create({
    data: {
      userId,
      action: "DELETE",
      module: "comment",
      targetId: commentId,
      detail: {
        preview: existing.content.slice(0, 80),
      },
    },
  });

  return existing;
}
