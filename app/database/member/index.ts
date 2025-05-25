import type { PaginationInput } from '@/utils/search';
import prisma from '@/database';

export function findMembersAndCount(pagination: PaginationInput) {
  return Promise.all([
    prisma.member.findMany({
      ...pagination,
      where: {
        isDeactivated: false,
      },
      include: {
        institution: {
          select: { name: true },
        },
      },
      omit: {
        password: true,
      },
      orderBy: {
        joinedAt: 'desc'
      },
    }),
    prisma.member.count({
      where: {
        isDeactivated: false,
      },
    }),
  ]);
}
