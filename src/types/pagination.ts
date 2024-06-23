export interface Pagination {
  search: string;
  page: number;
  take: number;
}

export type PaginationParams = Record<keyof Pagination, string>;

export interface PaginatedData<T extends object> {
  data: T[];
  total: number;
}
