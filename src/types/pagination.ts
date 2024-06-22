export interface Pagination {
  search: string;
  page: number;
  take: number;
}

export type QueryParams = Record<keyof Pagination, string>;

export interface ResponseData<T extends object> {
  data: T[];
  total: number;
}
