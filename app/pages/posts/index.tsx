import { Info } from 'lucide-react';

import AdminLayout from "@/components/admin-layout"
import SearchFilter from "@/components/search-filter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  buildPaginationQuery,
  parseSearchQuery,
  parseAdminURL, getPageLink,
} from '@/utils/search';
import type { Route } from './+types';
import AdminPagination from '@/components/admin-pagination';
import {
  deletePost,
  findPostsAndCount,
  type TabledPost,
} from '@/database/posts';
import { Await, redirect, useNavigate } from 'react-router';
import { Suspense, useState } from 'react';
import { CenteredSpinner } from '@/components/spinner';
import { z } from 'zod';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSession } from '@/utils/session.server';
import PostInfoModal from '@/features/posts/info-modal';


const PostSearchSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  isDeactivated: z.coerce.boolean().optional(),
  authorName: z.string(),
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
  if(!formData.has('postId')) {
    return;
  }
  const postId = parseInt(formData.get('postId')!.toString());
  await deletePost(postId);
  return {
    message: '삭제가 완료되었습니다',
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if(! session.has('memberId')) {
    return redirect(`/login`);
  }
  const { page, limit, search } = parseAdminURL(request);
  const pagination = buildPaginationQuery(page, limit);
  const { id, title, content, isDeactivated, authorName } = parseSearchQuery(search, PostSearchSchema);

  const findPostResult = findPostsAndCount(pagination, {
    isDeactivated: false,
    ...(title && { title: { contains: title } }),
    ...(content && { content: { contains: content } }),
    ...(isDeactivated && { isDeactivated }),
    ...(id && { id }),
    ...(authorName && { author: { name: { contains: authorName }}})
  });

  return {
    page,
    limit,
    search,
    findPostResult,
  };
}

export default function PostsPage({ loaderData }: Route.ComponentProps) {
  const { page, limit, search, findPostResult } = loaderData;
  const navigate = useNavigate();
  const debounce = useDebounce();
  const [selectedPost, setSelectedPost] = useState<TabledPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900">게시글 관리</h2>
          <p className="text-gray-600 mt-1">등록된 게시글을 관리하고 모니터링하세요</p>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchPlaceholder="검색 (검색항목:값)"
          onSearchChange={debounce((value: string) => {
            navigate(getPageLink(1, limit, value));
          }, 500)}
          defaultValue={search}
        />

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">사용 가능한 검색 파라미터:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">id:숫자</Badge>
                <Badge variant="secondary">title:제목</Badge>
                <Badge variant="secondary">content:내용</Badge>
                <Badge variant="secondary">authorName:작성자명</Badge>
                <Badge variant="secondary">isDeactivated:true/false</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                예시: <code className="bg-muted px-1 rounded">title:공지사항,authorName:관리자</code> 또는{" "}
                <code className="bg-muted px-1 rounded">id:123</code>
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Posts Table */}
        <Card>
          <Suspense fallback={<CenteredSpinner />}>
            <Await resolve={findPostResult}>
              {([posts, totalCount]) => {
                const totalPages = Math.ceil(totalCount / limit);
                return (
                  <>
                    <CardHeader>
                      <CardTitle>게시글 목록</CardTitle>
                      <CardDescription>총 {totalCount}개의 게시글을 관리하세요</CardDescription>
                    </CardHeader><CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>아이디</TableHead>
                          <TableHead>제목</TableHead>
                          <TableHead>작성자</TableHead>
                          <TableHead>작성일</TableHead>
                          <TableHead>소속 학교</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={`post-${post.id}`} onClick={() => {
                            setSelectedPost(post);
                            setIsModalOpen(true);
                          }}
                            className="cursor-pointer"
                          >
                            <TableCell className='font-medium'>{post.id}</TableCell>
                            <TableCell className='font-medium'>{post.title}</TableCell>
                            <TableCell>{post.author?.name ?? '알 수 없음'}</TableCell>
                            <TableCell>{new Date(
                              post.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{post.institution?.name ?? '정보 없음'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <AdminPagination
                      page={page}
                      totalPages={totalPages}
                      search={search}
                      limit={limit}
                    />
                  </CardContent>
                  </>
                );
              }}
            </Await>
          </Suspense>
        </Card>
      </div>
      {isModalOpen && <PostInfoModal post={selectedPost} open={isModalOpen} onOpenChange={(value) => {setIsModalOpen(value)}} />}
    </AdminLayout>
  )
}
