import { InvalidPaginationError } from '@/lib/errors/inputExceptions';

export default function paginate<T>(
  items: T[],
  currPage: number,
  pageSize: number,
): { data: T[]; totalPages: number; totalRecords: number } {
  if (currPage < 1 || pageSize < 1) {
    throw new InvalidPaginationError(currPage, pageSize);
  }

  const totalRecords = items.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  if (currPage > totalPages) {
    return { data: [], totalPages, totalRecords };
  }

  const startIndex = (currPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const data = items.slice(startIndex, endIndex);

  return {
    data,
    totalPages,
    totalRecords,
  };
}
