import type { PaginationInput } from '@/utils/search';
import prisma from '@/database';
import type { MemberWhereInput } from '@/generated/prisma/models/Member';
import bcrypt from 'bcryptjs';
import type { Member } from '@/generated/prisma';

export type TabledMember = Awaited<ReturnType<typeof findMembersAndCount>>[0][number];

export async function deactivateMember(member: Member | TabledMember | number) {
  if(typeof member !== 'number') {
    member = member.id;
  }
  await maskMember(member);
  await deleteAllChatsByMember(member);
  await unlinkPostsByMember(member);
}

export function deleteAllChatsByMember(member: Member | number) {
  if(typeof member !== 'number') {
    member = member.id;
  }
  return prisma.$transaction([
    prisma.chatRoom.updateMany({
      where: {
        OR: [{ requesterId: member }, { authorId: member }],
      },
      data: {
        isDeactivated: true,
      }
    }),
    prisma.chat.deleteMany({
      where: {
        senderId: member,
      }
    })
  ]);
}
export function unlinkPostsByMember(member: Member | number) {
  if(typeof member !== 'number') {
    member = member.id;
  }
  return prisma.post.updateMany({
    where: {
      authorId: member,
      markerId: { not: null }
    },
    data: {
      markerId: null
    }
  });
}



export function maskMember(member: Member | number) {
  if(typeof member !== 'number') {
    member = member.id;
  }
  return prisma.member.update({
    where: {
      id: member,
    },
    data: {
      email: null,
      name: '탈퇴한 사용자',
      password: '',
      birth: new Date('1970-01-01'),
      isDeactivated: true,
      gender: 3,
      expoToken: null,
    }
  });
}

export function findMembersAndCount(pagination: PaginationInput, where?: MemberWhereInput) {
  return Promise.all([
    prisma.member.findMany({
      ...pagination,
      where,
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
        ...where
      },
    }),
  ]);
}

export async function findMemberByAuthInfo(email: string, password: string) {
  const hashed = await hashPassword(password);
  return prisma.member.findFirst({
    where: {
      email,
      password: hashed,
    },
    omit: {
      password: true,
    }
  });
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, process.env.PASSWORD_SECRET!);
}
