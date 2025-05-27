import type { LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';

export interface PaginationInput {
  take: number;
  skip: number;
}

export function parseAdminURL(request: LoaderFunctionArgs['request']) {
  const url = new URL(request.url);

  const pageParam = url.searchParams.get('page');
  const limitParam = url.searchParams.get('limit');

  const page = parseInt(pageParam || '1');
  const limit = parseInt(limitParam || '10');
  const search = url.searchParams.get('search');

  return {
    page,
    limit,
    ...(search && { search })
  }
}

export function buildPaginationQuery(page: number, limit: number): PaginationInput {
  const offset = (page - 1) * limit;
  return {
    take: limit,
    skip: offset,
  }
}

export function parseSearchQuery<T extends z.ZodSchema>(search: ReturnType<typeof parseAdminURL>['search'],
                                 schema: T) {
  const whereInput: Record<string, any> = {};

  if(search) {
    const searchTargets = search.split(',');
    searchTargets.forEach((target)  => {
      const splitted = target.trimStart().split(':');
      if(splitted.length < 2)
        return;
      const [key, value] = splitted;
      whereInput[key] = value;
    });
  }
  const where = schema.optional().safeParse(whereInput);

  if(where.success) {
    return where.data!;
  }
  return whereInput;
}

export function getNextPageLink(page: number, totalPages: number, direction = 1, limit?: number, search?: string) {
  const nextPage = direction === 1 ? Math.min(page + 1, totalPages) : Math.max(page - 1, 1);
  return getPageLink(nextPage, limit, search);
}

export function getPageLink(page: number, limit?: number, search?: string) {

  const params = new URLSearchParams({ page: page.toString() });

  if (search) params.append('search', search);
  if (limit) params.append('limit', limit.toString());

  return `?${params.toString()}`;
}

