import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
// add trees module
// add create, get, update and delete trees
// on delete and update and getOne check that user owns a tree
// create module for managing relationships in tree
import { GetUserData } from '@/decorators/get-user-data.decorator';
import { PaginatedData } from '@/types/common';
import { SecureUser } from '@/types/user';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseJwtGuard()
@Controller('user')
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
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('take', new DefaultValuePipe(100), ParseIntPipe) take: number,
  ): Promise<PaginatedData<SecureUser>> {
    return this.usersService.getMany({ search, page, take });
  }

  @Delete()
  remove(@GetUserData('userId') id: string): Promise<SecureUser> {
    return this.usersService.remove(id);
  }
}