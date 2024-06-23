import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { Pagination, PaginationParams } from '@/types/pagination';
import { clearEmpties } from '@/utils';

@Injectable()
export class PaginationPipe implements PipeTransform {
  private defaultValues: PaginationParams = {
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

  transform(query: Partial<PaginationParams>): Pagination {
    const queryValues = clearEmpties(query);

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
