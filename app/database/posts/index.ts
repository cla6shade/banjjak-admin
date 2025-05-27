import prisma from '@/database';
import type { PaginationInput } from '@/utils/search';
import type { PostWhereInput } from '@/generated/prisma/models/Post';

export type TabledPost = Awaited<ReturnType<typeof findPostsAndCount>>[0][number];

export function deletePost(postId: number) {
  return prisma.post.update({
    where: { id: postId },
    data: {
      isDeactivated: true,
      markerId: null,
    }
  });
}

export function findPostsAndCount(pagination: PaginationInput, where?: PostWhereInput) {
  return Promise.all([
    prisma.post.findMany({
      ...pagination,
      where,
      include: {
        author: {
          select: { name: true },
        },
        institution: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    }),
    prisma.post.count({
      where: {
        isDeactivated: false,
        ...where,
      },
    }),
  ]);
}
