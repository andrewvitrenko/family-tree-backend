import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { Pagination, QueryParams } from '@/types/pagination';

@Injectable()
export class PaginationPipe implements PipeTransform {
  private defaultValues: QueryParams = {
    search: '',
    page: '1',
    take: '20',
  };

  private parseInt(value: string): number {
    const parsed = parseInt(value);

    if (isNaN(parsed)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    return parsed;
  }

  transform(query: Partial<QueryParams>): Pagination {
    const queryValues: Partial<QueryParams> = Object.fromEntries(
      Object.entries(query).filter(([, value]) =>
        typeof value === 'string' ? Boolean(value) : true,
      ),
    );

    const { search, page, take } = { ...this.defaultValues, ...queryValues };

    const parsedPage = this.parseInt(page);
    const parsedTake = this.parseInt(take);

    if (parsedPage < 1 || parsedTake < 1) {
      throw new BadRequestException(
        'Validation failed (should be greater than 0)',
      );
    }

    return { search, page: parsedPage, take: parsedTake };
  }
}
