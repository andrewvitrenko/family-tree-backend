import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Tree } from '@prisma/client';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
import { GetUserData } from '@/decorators/get-user-data.decorator';
import { PaginationPipe } from '@/pagination/pagination.pipe';
import { CreateTreeDto } from '@/trees/dto/create-tree.dto';
import { UpdateTreeDto } from '@/trees/dto/update-tree.dto';
import { Roles, TreesGuard } from '@/trees/trees.guard';
import { TreesService } from '@/trees/trees.service';
import { Pagination, ResponseData } from '@/types/pagination';

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
    @Query(new PaginationPipe()) query: Pagination,
    @GetUserData('userId') userId: string,
  ): Promise<ResponseData<Tree>> {
    return this.treesService.getMany(userId, query);
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
