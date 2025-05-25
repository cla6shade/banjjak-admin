
import { useState } from "react"
import { MoreHorizontal, Eye, Ban, Trash2 } from "lucide-react"

import AdminLayout from "@/components/admin-layout"
import SearchFilter from "@/components/search-filter"
import { getStatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const chats = [
  {
    id: 1,
    participants: ["김철수", "이영희"],
    lastMessage: "안녕하세요! 프로젝트 관련해서 문의드립니다.",
    timestamp: "2024-03-15 14:30",
    status: "active",
  },
  {
    id: 2,
    participants: ["박민수", "정수진"],
    lastMessage: "부적절한 언어 사용",
    timestamp: "2024-03-15 13:45",
    status: "reported",
  },
  {
    id: 3,
    participants: ["최동현", "김철수"],
    lastMessage: "코드 리뷰 부탁드립니다.",
    timestamp: "2024-03-15 12:20",
    status: "active",
  },
  {
    id: 4,
    participants: ["이영희", "정수진"],
    lastMessage: "디자인 피드백 감사합니다.",
    timestamp: "2024-03-15 11:15",
    status: "active",
  },
  {
    id: 5,
    participants: ["박민수", "최동현"],
    lastMessage: "스팸 메시지 발송",
    timestamp: "2024-03-15 10:30",
    status: "blocked",
  },
]

const chatFilterOptions = [
  { value: "all", label: "전체" },
  { value: "active", label: "활성" },
  { value: "reported", label: "신고됨" },
  { value: "blocked", label: "차단됨" },
]

export default function ChatsPage() {
  const [filteredChats, setFilteredChats] = useState(chats)

  const handleSearch = (searchTerm: string) => {
    const filtered = chats.filter(
      (chat) =>
        chat.participants.some((participant) => participant.toLowerCase().includes(searchTerm.toLowerCase())) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredChats(filtered)
  }

  const handleFilter = (status: string) => {
    if (status === "all") {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter((chat) => chat.status === status)
      setFilteredChats(filtered)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">채팅 관리</h2>
          <p className="text-gray-600 mt-1">사용자 간 채팅을 모니터링하고 관리하세요</p>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          onSearchChange={handleSearch}
          onFilterChange={handleFilter}
          filterOptions={chatFilterOptions}
          searchPlaceholder="참여자 또는 메시지 내용 검색..."
          filterPlaceholder="채팅 상태"
        />

        {/* Chats Table */}
        <Card>
          <CardHeader>
            <CardTitle>채팅 목록</CardTitle>
            <CardDescription>사용자 간 채팅을 모니터링하고 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>참여자</TableHead>
                  <TableHead>마지막 메시지</TableHead>
                  <TableHead>시간</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChats.map((chat) => (
                  <TableRow key={chat.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {chat.participants.map((participant, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-white">
                              <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-sm">{chat.participants.join(", ")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{chat.lastMessage}</TableCell>
                    <TableCell>{chat.timestamp}</TableCell>
                    <TableCell>{getStatusBadge(chat.status)}</TableCell>
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
                            채팅 보기
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Ban className="mr-2 h-4 w-4" />
                            채팅 차단
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            채팅 삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
