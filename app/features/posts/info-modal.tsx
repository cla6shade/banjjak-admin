import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, FileText, Eye, Heart, User } from "lucide-react"
import { useFetcher } from "react-router"
import type { TabledPost } from '@/database/posts';

interface PostInfoModalProps {
  post: TabledPost | null;
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function PostInfoModal({ post, trigger, open, onOpenChange }: PostInfoModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fetcher = useFetcher();

  if(! post){
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

  const getStatusColor = (isDeactivated: boolean) => {
    return isDeactivated ? "bg-red-100 text-red-800 hover:bg-red-100" : "bg-green-100 text-green-800 hover:bg-green-100"
  }

  const getStatusText = (isDeactivated: boolean) => {
    return isDeactivated ? "비활성화" : "활성화"
  }

  const isExpired = new Date() > post.expiresAt

  const handleDeactivate = async () => {
    await fetcher.submit({ postId: post.id.toString() }, { method: "DELETE", action: "/admin/posts" })
    onOpenChange?.(false)
    setShowDeleteConfirm(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            게시글 정보
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>게시글 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 제목 섹션 */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(post.isDeactivated)}>{getStatusText(post.isDeactivated)}</Badge>
                {isExpired && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">만료됨</Badge>}
              </div>
            </div>
          </div>

          <Separator />

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">작성자</p>
                <p className="text-sm text-muted-foreground">{post.author.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">내용</p>
                <p className="text-sm text-muted-foreground">{post.content}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">주소</p>
                <p className="text-sm text-muted-foreground">{post.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">소속 학교</p>
                <p className="text-sm text-muted-foreground">{post.institution.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">좋아요</p>
                  <p className="text-sm text-muted-foreground">{post.likeCount}개</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">조회수</p>
                  <p className="text-sm text-muted-foreground">{post.viewCount}회</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 시간 정보 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">작성일</p>
                <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">만료일</p>
                <p className="text-sm text-muted-foreground">{formatDate(post.expiresAt)}</p>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          {!showDeleteConfirm ? (
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                닫기
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={post.isDeactivated}>
                {post.isDeactivated ? "이미 삭제됨" : "삭제 처리"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">삭제 처리 확인</h4>
                <p className="text-sm text-red-700">
                  <strong>{post.title}</strong> 게시글을 정말 삭제 처리하시겠습니까?
                </p>
                <p className="text-xs text-red-600 mt-2">이 작업은 되돌릴 수 없으며, 게시글이 비활성화됩니다.</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={fetcher.state === "submitting"}
                >
                  취소
                </Button>
                <Button variant="destructive" onClick={handleDeactivate} disabled={fetcher.state === "submitting"}>
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
