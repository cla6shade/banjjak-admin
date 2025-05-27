import AdminLayout from "@/components/admin-layout"
import StatsCards from "@/components/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Route } from './+types';
import { getSession } from '@/utils/session.server';
import { redirect } from 'react-router';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if(! session.has('memberId')) {
    return redirect(`/login`);
  }
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">대시보드</h2>
          <p className="text-gray-600 mt-1">전체 시스템 현황을 한눈에 확인하세요</p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
              <CardDescription>최근 시스템 활동 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">새로운 사용자 가입</p>
                    <p className="text-xs text-gray-500">김철수님이 가입했습니다</p>
                  </div>
                  <span className="text-xs text-gray-400">2분 전</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">새 게시글 작성</p>
                    <p className="text-xs text-gray-500">React 개발 팁 공유</p>
                  </div>
                  <span className="text-xs text-gray-400">5분 전</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">신고 접수</p>
                    <p className="text-xs text-gray-500">부적절한 내용 신고</p>
                  </div>
                  <span className="text-xs text-gray-400">10분 전</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>시스템 상태</CardTitle>
              <CardDescription>현재 시스템 운영 상태</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">서버 상태</span>
                  <span className="text-sm text-green-600">정상</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">데이터베이스</span>
                  <span className="text-sm text-green-600">정상</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API 응답시간</span>
                  <span className="text-sm text-yellow-600">125ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">활성 사용자</span>
                  <span className="text-sm text-blue-600">342명</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
