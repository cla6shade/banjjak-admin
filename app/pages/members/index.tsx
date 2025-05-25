import { MoreHorizontal, Eye, Edit, Ban, Trash2 } from "lucide-react"

import AdminLayout from "@/components/admin-layout"
import SearchFilter from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Route } from './+types';
import {
  buildPaginationQuery,
  parseURLPagination,
} from '@/utils/search';
import AdminPagination from '@/components/admin-pagination';
import { findMembersAndCount } from '@/database/member';


export async function loader({ request }: Route.LoaderArgs) {
  const { page, limit } = parseURLPagination(request);
  const pagination = buildPaginationQuery(page, limit);
  const [members, totalCount] = await findMembersAndCount(pagination);

  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    members,
  };
}

export default function UsersPage({ loaderData }: Route.ComponentProps) {
  const { page, limit, totalCount, totalPages, members } = loaderData;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">사용자 관리</h2>
          <p className="text-gray-600 mt-1">사용자 계정을 관리하고 모니터링하세요</p>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchPlaceholder="사용자 이름 또는 이메일 검색..."
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 목록</CardTitle>
            <CardDescription>총 {totalCount}명의 사용자를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>소속 기관</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.email ?? '없음'}</TableCell>
                    <TableCell>{new Date(
                      member.joinedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{member.institution?.name ??
                      '정보 없음'}</TableCell>
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
