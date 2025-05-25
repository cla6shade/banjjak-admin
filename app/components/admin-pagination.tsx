import {
  Pagination,
  PaginationContent,
  PaginationItem, PaginationLink,
} from '@/components/ui/pagination';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
}

export default function AdminPagination({ page, totalPages }: AdminPaginationProps) {
  return (
    <div className="mt-4 flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* 이전 페이지 */}
          <PaginationItem>
            <PaginationLink
              href={`?page=${Math.max(page - 1, 1)}`}
              isActive={false}
            >
              이전
            </PaginationLink>
          </PaginationItem>

          {/* 숫자 페이지 링크 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <PaginationItem key={num}>
              <PaginationLink
                href={`?page=${num}`}
                isActive={num === page}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 다음 페이지 */}
          <PaginationItem>
            <PaginationLink
              href={`?page=${Math.min(page + 1, totalPages)}`}
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
