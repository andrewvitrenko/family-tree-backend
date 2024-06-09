import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// parse here query and get all pagination fields, check them for errors, throw exceptions if needed

@Injectable()
export class PaginationPipe implements PipeTransform {
  // eslint-disable-next-line
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
