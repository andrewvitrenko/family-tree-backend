import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Tree } from '@prisma/client';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
import { GetUserData } from '@/decorators/get-user-data.decorator';
import { CreateTreeDto } from '@/trees/dto/create-tree.dto';
import { UpdateTreeDto } from '@/trees/dto/update-tree.dto';
import { Roles, TreesGuard } from '@/trees/trees.guard';
import { TreesService } from '@/trees/trees.service';

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
  getAll(@GetUserData('userId') userId: string): Promise<Tree[]> {
    return this.treesService.getAll(userId);
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
