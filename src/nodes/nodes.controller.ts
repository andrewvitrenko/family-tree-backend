import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Node } from '@prisma/client';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';

import { AddNodeDto } from './dto/add-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { LastNodeGuard } from './last-node.guard';
import { NodesGuard } from './nodes.guard';
import { NodesService } from './nodes.service';

@NodesGuard()
@UseJwtGuard()
@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Post('/:treeId/:nodeId/add-child')
  addChild(
    @Param('treeId', ParseUUIDPipe) treeId: string,
    @Param('nodeId', ParseUUIDPipe) nodeId: string,
    @Body() addNodeDto: AddNodeDto,
  ): Promise<Node> {
    return this.nodesService.addChild(treeId, nodeId, addNodeDto);
  }

  @Post('/:treeId/:nodeId/add-parent')
  addParent(
    @Param('treeId', ParseUUIDPipe) treeId: string,
    @Param('nodeId', ParseUUIDPipe) nodeId: string,
    @Body() addNodeDto: AddNodeDto,
  ): Promise<Node> {
    return this.nodesService.addParent(treeId, nodeId, addNodeDto);
  }

  @Patch('/:treeId/:nodeId')
  update(
    @Param('nodeId', ParseUUIDPipe) nodeId: string,
    @Body() updateNodeDto: UpdateNodeDto,
  ): Promise<Node> {
    return this.nodesService.update(nodeId, updateNodeDto);
  }

  @LastNodeGuard()
  @Delete('/:treeId/:nodeId')
  remove(@Param('nodeId', ParseUUIDPipe) nodeId: string): Promise<Node> {
    return this.nodesService.remove(nodeId);
  }
}
