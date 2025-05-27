import { Info } from 'lucide-react';

import AdminLayout from '@/components/admin-layout';
import SearchFilter from '@/components/search-filter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Route } from './+types';
import {
  buildPaginationQuery, getPageLink,
  parseAdminURL, parseSearchQuery,
} from '@/utils/search';
import AdminPagination from '@/components/admin-pagination';
import {
  deactivateMember,
  findMembersAndCount,
  type TabledMember,
} from 'app/database/members';
import { Suspense, useEffect, useState } from 'react';
import {
  Await,
  redirect,
  useNavigate,
} from 'react-router';
import { CenteredSpinner } from '@/components/spinner';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';
import { getSession } from '@/utils/session.server';
import MemberInfoModal from '@/features/members/info-modal';
import { toast } from 'sonner';

const MemberSearchSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  institution: z.string().optional(),
});

export async function action({request}: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('memberId')) {
    return redirect(`/login`);
  }
  const {method} = request;
  const formData = await request.formData();
  if(method !== 'DELETE')
    return;
  if(!formData.has('memberId')) {
    return;
  }
  const memberId = parseInt(formData.get('memberId')!.toString());
  await deactivateMember(memberId);
  return {
    message: '삭제가 완료되었습니다',
  }
}

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('memberId')) {
    return redirect(`/login`);
  }
  const {page, limit, search} = parseAdminURL(request);
  const pagination = buildPaginationQuery(page, limit);
  const {id, name, email, institution: institutionName} = parseSearchQuery(
    search, MemberSearchSchema);

  const findMemberResult = findMembersAndCount(pagination, {
    isDeactivated: false,
    ...(id && {id}),
    ...(name && {name}),
    ...(institutionName && {institution: {name: institutionName}}),
    ...(email && {email}),
  });

  return {
    page,
    limit,
    search,
    findMemberResult,
  };
}

export default function MembersPage({loaderData, actionData}: Route.ComponentProps) {
  const { page, limit, search, findMemberResult } = loaderData;
  const navigate = useNavigate();
  const debounce = useDebounce();

  const [selectedMember, setSelectedMember] = useState<TabledMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if(actionData?.message){
      toast.success(actionData?.message, {richColors: true});
    }
  }, []);

  return (
    <>
      <AdminLayout>
        <div className='p-6'>
          {/* Header */}
          <div className='mb-4'>
            <h2 className='text-3xl font-bold text-gray-900'>사용자 관리</h2>
            <p className='text-gray-600 mt-1'>사용자 계정을 관리하고 모니터링하세요</p>
          </div>

          {/* Search and Filter */}
          <SearchFilter
            searchPlaceholder='사용자 이름 또는 이메일 검색...'
            onSearchChange={debounce((value: string) => {
              navigate(getPageLink(1, limit, value));
            }, 500)}
            defaultValue={search}
          />

          <Alert className='mb-4'>
            <Info className='h-4 w-4' />
            <AlertDescription>
              <div className='space-y-2'>
                <p className='font-medium'>사용 가능한 검색 파라미터:</p>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='secondary'>id:숫자</Badge>
                  <Badge variant='secondary'>name:이름</Badge>
                  <Badge variant='secondary'>email:이메일</Badge>
                  <Badge variant='secondary'>institution:소속</Badge>
                </div>
                <p className='text-sm text-muted-foreground mt-2'>
                  예시: <code
                  className='bg-muted px-1 rounded'>name:홍길동,institution:서울대</code> 또는{' '}
                  <code className='bg-muted px-1 rounded'>id:1</code>
                </p>
              </div>
            </AlertDescription>
          </Alert>
          {/* Users Table */}
          <Card>
            <Suspense fallback={<CenteredSpinner />}>
              <Await resolve={findMemberResult}>
                {([members, totalCount]) => {
                  const totalPages = Math.ceil(totalCount / limit);
                  return (
                    <>
                      <CardHeader>
                        <CardTitle>사용자 목록</CardTitle>
                        <CardDescription>총 {totalCount}명의 사용자를
                          관리하세요</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>이름</TableHead>
                              <TableHead>이메일</TableHead>
                              <TableHead>가입일</TableHead>
                              <TableHead>소속 기관</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {members.map((member) => (
                              <TableRow key={`member-${member.id}`} onClick={() => {
                                setSelectedMember(member);
                                setIsModalOpen(true);
                              }}
                                className="cursor-pointer"
                              >
                                <TableCell>
                                  <div className='flex items-center space-x-3'>
                                    <span
                                      className='font-medium'>{member.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{member.email ?? '없음'}</TableCell>
                                <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                                <TableCell>{member.institution?.name ?? '정보 없음'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <AdminPagination page={page} totalPages={totalPages}
                          search={search} limit={limit} />
                      </CardContent>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </Card>
        </div>
      </AdminLayout>
      {isModalOpen
        ? <MemberInfoModal member={selectedMember} open={isModalOpen} onOpenChange={(value) => setIsModalOpen(value)} />
        : null
      }
    </>
  );
}
