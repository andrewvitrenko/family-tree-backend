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
import { Node, Tree } from '@prisma/client';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';
import { UserData } from '@/decorators/user-data.decorator';
import { PaginationPipe } from '@/pipes/pagination.pipe';
import { AddNodeDto } from '@/trees/dto/add-node.dto';
import { CreateTreeDto } from '@/trees/dto/create-tree.dto';
import { UpdateNodeDto } from '@/trees/dto/update-node.dto';
import { UpdateTreeDto } from '@/trees/dto/update-tree.dto';
import { NodesService } from '@/trees/nodes.service';
import { TreesGuard } from '@/trees/trees.guard';
import { TreesService } from '@/trees/trees.service';
import { PaginatedData, Pagination } from '@/types/pagination';

@UseJwtGuard()
@Controller('trees')
export class TreesController {
  constructor(
    private readonly treesService: TreesService,
    private readonly nodesService: NodesService,
  ) {}

  @TreesGuard()
  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tree> {
    return this.treesService.getOne(id);
  }

  @Get()
  getMany(
    @Query(new PaginationPipe()) query: Pagination,
    @UserData('userId') userId: string,
  ): Promise<PaginatedData<Tree>> {
    return this.treesService.getMany(userId, query);
  }

  @Post()
  create(
    @UserData('userId') userId: string,
    @Body() createTreeDto: CreateTreeDto,
  ): Promise<Tree> {
    return this.treesService.create(userId, createTreeDto);
  }

  @TreesGuard()
  @Patch('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTreeDto: UpdateTreeDto,
  ): Promise<Tree> {
    return this.treesService.update(id, updateTreeDto);
  }

  @TreesGuard()
  @Delete('/:id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Tree> {
    return this.treesService.remove(id);
  }

  @Post('/:treeId/node')
  addNode(
    @Param('treeId', ParseUUIDPipe) treeId: string,
    @Body() addNodeDto: AddNodeDto,
  ): Promise<Node> {
    return this.nodesService.add(treeId, addNodeDto);
  }

  @Patch('/:treeId/node/:nodeId')
  updateNode(
    @Param('nodeId', ParseUUIDPipe) nodeId: string,
    @Body() updateNodeDto: UpdateNodeDto,
  ): Promise<Node> {
    return this.nodesService.update(nodeId, updateNodeDto);
  }

  @Delete('/:treeId/node/:nodeId')
  removeNode(@Param('nodeId', ParseUUIDPipe) nodeId: string): Promise<Node> {
    return this.nodesService.remove(nodeId);
  }
}
