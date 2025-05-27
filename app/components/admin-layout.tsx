import type React from "react"

import { Users, FileText, MessageSquare, LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLocation, useNavigate } from 'react-router';
import { Toaster } from '@/components/ui/sonner';

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  {
    name: "대시보드",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "사용자 관리",
    href: "/admin/members",
    icon: Users,
  },
  {
    name: "게시글 관리",
    href: "/admin/posts",
    icon: FileText,
  },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
        </div>
        <nav className="mt-6">
          <div className="px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", isActive && "bg-gray-100")}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
      <Toaster />
    </div>
  )
}
