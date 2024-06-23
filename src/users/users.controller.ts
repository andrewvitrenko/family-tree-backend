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
import { UserData } from '@/decorators/user-data.decorator';
import { PaginationPipe } from '@/pipes/pagination.pipe';
import { PaginatedData, Pagination } from '@/types/pagination';
import { SecureUser } from '@/types/user';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseJwtGuard()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch()
  update(
    @UserData('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SecureUser> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Get('/me')
  getMe(@UserData('userId') userId: string): Promise<SecureUser> {
    return this.usersService.get(userId);
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<SecureUser> {
    return this.usersService.get(id);
  }

  @Get()
  getMany(
    @Query(new PaginationPipe()) query: Pagination,
  ): Promise<PaginatedData<SecureUser>> {
    return this.usersService.getMany(query);
  }

  @Delete()
  remove(@UserData('userId') id: string): Promise<SecureUser> {
    return this.usersService.remove(id);
  }
}
