import {
  Pagination,
  PaginationContent,
  PaginationItem, PaginationLink,
} from '@/components/ui/pagination';
import { getNextPageLink, getPageLink } from '@/utils/search';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  search?: string;
  limit?: number;
}

export default function AdminPagination({ page, totalPages, search, limit }: AdminPaginationProps) {
  return (
    <div className="mt-4 flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* 이전 페이지 */}
          <PaginationItem>
            <PaginationLink
              href={getNextPageLink(page, totalPages, -1, limit, search)}
              isActive={false}
            >
              이전
            </PaginationLink>
          </PaginationItem>

          {/* 숫자 페이지 링크 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <PaginationItem key={num}>
              <PaginationLink
                href={getPageLink(num, limit, search)}
                isActive={num === page}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 다음 페이지 */}
          <PaginationItem>
            <PaginationLink
              href={getNextPageLink(page, totalPages, 1, limit, search)}
              isActive={false}
            >
              다음
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
