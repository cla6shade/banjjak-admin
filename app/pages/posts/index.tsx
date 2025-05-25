import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

import AdminLayout from "@/components/admin-layout"
import SearchFilter from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import prisma from '@/database';
import { buildPaginationQuery, parseURLPagination } from '@/utils/search';
import type { Route } from './+types';
import AdminPagination from '@/components/admin-pagination';


export async function loader({ request }: Route.LoaderArgs) {
  const { page, limit } = parseURLPagination(request);
  const pagination = buildPaginationQuery(page, limit);

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      ...pagination,
      where: {
        isDeactivated: false,
      },
      include: {
        author: {
          select: { name: true },
        },
        institution: {
          select: { name: true },
        },
      },
    }),
    prisma.post.count({
      where: {
        isDeactivated: false,
      },
    }),
  ]);

  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    posts,
  };
}

export default function PostsPage({ loaderData }: Route.ComponentProps) {
  const { page, limit, totalCount, totalPages, posts } = loaderData;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">게시글 관리</h2>
          <p className="text-gray-600 mt-1">등록된 게시글을 관리하고 모니터링하세요</p>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchPlaceholder="제목 또는 작성자 검색..."
        />

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>게시글 목록</CardTitle>
            <CardDescription>총 {totalCount}개의 게시글을 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>아이디</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead>소속 기관</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.id}</TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author?.name ?? '알 수 없음'}</TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{post.institution?.name ?? '정보 없음'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            상세보기
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination page={page} totalPages={totalPages}/>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
