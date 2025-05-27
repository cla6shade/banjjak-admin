import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, User, Shield } from "lucide-react"
import type { TabledMember } from '@/database/members';
import { useFetcher } from 'react-router';

interface UserInfoModalProps {
  member: TabledMember | null;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function MemberInfoModal({ member, trigger, open, onOpenChange }: UserInfoModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fetcher = useFetcher();

  if(! member) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0:
        return "남성"
      case 1:
        return "여성"
      default:
        return "기타"
    }
  }

  const getAdminText = (isAdmin: number) => {
    return isAdmin === 1 ? "관리자" : "일반 사용자"
  }

  const getAdminColor = (isAdmin: number) => {
    return isAdmin === 1
      ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }

  const getStatusColor = (isDeactivated: boolean) => {
    return isDeactivated ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-green-100 text-green-800 hover:bg-green-100"
  }

  const getStatusText = (isDeactivated: boolean) => {
    return isDeactivated ? "비활성화" : "활성화"
  }

  const handleDeactivate = async () => {
    await fetcher.submit({ memberId: member.id.toString() }, { method: "DELETE", action: "/admin/members" })
    onOpenChange?.(false)
    setShowDeleteConfirm(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            사용자 정보
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 프로필 섹션 */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getAdminColor(member.isAdmin)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {getAdminText(member.isAdmin)}
                </Badge>
                <Badge className={getStatusColor(member.isDeactivated)}>{getStatusText(member.isDeactivated)}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">이메일</p>
                <p className="text-sm text-muted-foreground">{member.email || "등록되지 않음"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">성별</p>
                <p className="text-sm text-muted-foreground">{getGenderText(member.gender)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">생년월일</p>
                <p className="text-sm text-muted-foreground">{formatDate(member.birth)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">소속 학교</p>
                <p className="text-sm text-muted-foreground">{member.institution.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">신고 횟수</p>
                <p className="text-sm text-muted-foreground">{member.reportedCount}회</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 시간 정보 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">가입일</p>
                <p className="text-sm text-muted-foreground">{formatDate(member.joinedAt)}</p>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          {!showDeleteConfirm ? (
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                닫기
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={member.isDeactivated}>
                {member.isDeactivated ? "이미 탈퇴됨" : "탈퇴 처리"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">탈퇴 처리 확인</h4>
                <p className="text-sm text-red-700">
                  <strong>{member.name}</strong> 사용자를 정말 탈퇴 처리하시겠습니까?
                </p>
                <p className="text-xs text-red-600 mt-2">이 작업은 되돌릴 수 없으며, 사용자의 계정이 비활성화됩니다.</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  취소
                </Button>
                <Button variant="destructive" onClick={handleDeactivate} disabled={fetcher.state === 'submitting'}>
                  {fetcher.state === "submitting" ? "처리 중..." : "삭제 처리"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
