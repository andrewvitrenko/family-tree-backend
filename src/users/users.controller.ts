import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
import { GetUserData } from '@/decorators/get-user-data.decorator';
import { PaginationPipe } from '@/pagination/pagination.pipe';
import { Pagination, ResponseData } from '@/types/pagination';
import { SecureUser } from '@/types/user';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseJwtGuard()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch()
  update(
    @GetUserData('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SecureUser> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get('/me')
  getMe(@GetUserData('userId') userId: string): Promise<SecureUser> {
    return this.usersService.get(userId);
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<SecureUser> {
    return this.usersService.get(id);
  }

  @Get()
  getMany(
    @Query(new PaginationPipe()) query: Pagination,
  ): Promise<ResponseData<SecureUser>> {
    return this.usersService.getMany(query);
  }

  @Delete()
  remove(@GetUserData('userId') id: string): Promise<SecureUser> {
    return this.usersService.remove(id);
  }
}
