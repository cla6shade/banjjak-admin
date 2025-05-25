import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFilterProps {
  onSearchChange?: (value: string) => void
  onFilterChange?: (value: string) => void
  filterOptions?: { value: string; label: string }[]
  searchPlaceholder?: string
  filterPlaceholder?: string
}

export default function SearchFilter({
  onSearchChange,
  onFilterChange,
  filterOptions = [
    { value: "all", label: "전체" },
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" },
    { value: "banned", label: "차단됨" },
  ],
  searchPlaceholder = "검색...",
  filterPlaceholder = "상태 필터",
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={filterPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
