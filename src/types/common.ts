export const enum ENV {
  PORT = 'PORT',
  DATABASE_URL = 'DATABASE_URL',
  ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY',
}

export interface QueryParams {
  search?: string;
  page?: number;
  take?: number;
}

export interface PaginatedData<T extends object> {
  data: T[];
  total: number;
}
