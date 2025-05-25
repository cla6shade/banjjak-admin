import type { LoaderFunctionArgs } from 'react-router';

export interface PaginationInput {
  take: number;
  skip: number;
}

export function parseURLPagination(request: LoaderFunctionArgs['request']) {
  const url = new URL(request.url);

  const pageParam = url.searchParams.get('page');
  const limitParam = url.searchParams.get('limit');

  const page = parseInt(pageParam || '1');
  const limit = parseInt(limitParam || '10');

  return {
    page,
    limit,
  }
}

export function buildPaginationQuery(page: number, limit: number): PaginationInput {
  const offset = (page - 1) * limit;
  return {
    take: limit,
    skip: offset,
  }
}
