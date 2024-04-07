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

import { GetUserData } from '@/decorators/get-user-data.decorator';
import { UseJwtGuard } from '@/guards/jwt.guard';
import { PaginatedData } from '@/types/common';
import { SecureUser } from '@/types/user';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserService } from '@/user/user.service';

@UseJwtGuard()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch()
  update(
    @GetUserData('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SecureUser> {
    return this.userService.update(userId, updateUserDto);
  }

  @Get('/me')
  getMe(@GetUserData('userId') userId: string): Promise<SecureUser> {
    return this.userService.get(userId);
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<SecureUser> {
    return this.userService.get(id);
  }

  @Get()
  getMany(
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('take', new DefaultValuePipe(100), ParseIntPipe) take: number,
  ): Promise<PaginatedData<SecureUser>> {
    return this.userService.getMany({ search, page, take });
  }

  @Delete()
  remove(@GetUserData('userId') id: string): Promise<SecureUser> {
    return this.userService.remove(id);
  }
}
