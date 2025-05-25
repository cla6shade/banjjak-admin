import { Badge } from "@/components/ui/badge"

export function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          활성
        </Badge>
      )
    case "inactive":
      return <Badge variant="secondary">비활성</Badge>
    case "banned":
      return <Badge variant="destructive">차단됨</Badge>
    case "published":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          게시됨
        </Badge>
      )
    case "draft":
      return <Badge variant="secondary">임시저장</Badge>
    case "reported":
      return <Badge variant="destructive">신고됨</Badge>
    case "blocked":
      return <Badge variant="destructive">차단됨</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
