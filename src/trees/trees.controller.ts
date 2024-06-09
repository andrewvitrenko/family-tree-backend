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
  Post,
  Query,
} from '@nestjs/common';
import { Tree } from '@prisma/client';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
import { GetUserData } from '@/decorators/get-user-data.decorator';
import { CreateTreeDto } from '@/trees/dto/create-tree.dto';
import { UpdateTreeDto } from '@/trees/dto/update-tree.dto';
import { Roles, TreesGuard } from '@/trees/trees.guard';
import { TreesService } from '@/trees/trees.service';
import { PaginatedData } from '@/types/common';

@UseJwtGuard()
@Controller('trees')
export class TreesController {
  constructor(private treesService: TreesService) {}

  @TreesGuard()
  @Roles('member')
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tree> {
    return this.treesService.getOne(id);
  }

  @Get()
  getMany(
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
    @GetUserData('userId') userId: string,
  ): Promise<PaginatedData<Tree>> {
    return this.treesService.getMany(userId, { search, page, take });
  }

  @Post()
  create(
    @GetUserData('userId') userId: string,
    @Body() createTreeDto: CreateTreeDto,
  ): Promise<Tree> {
    return this.treesService.create(userId, createTreeDto);
  }

  @TreesGuard()
  @Roles('owner')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTreeDto: UpdateTreeDto,
  ): Promise<Tree> {
    return this.treesService.update(id, updateTreeDto);
  }

  @TreesGuard()
  @Roles('owner')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Tree> {
    return this.treesService.remove(id);
  }
}
