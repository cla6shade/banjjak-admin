import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchFilterProps {
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  defaultValue?: string;
}

export default function SearchFilter({
  onSearchChange,
  searchPlaceholder = "검색...",
  defaultValue,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}
