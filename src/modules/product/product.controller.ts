import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ProductService } from './product.service';

@ApiTags('产品管理')
@ApiBearerAuth()
@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/:productId')
  @ApiOperation({ summary: '获取产品详情' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findOne(@Param('productId') productId: string) {
    return this.productService.findOne(productId);
  }

  @Get('/:productId/tags')
  @ApiOperation({ summary: '获取产品标签列表' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findTags(@Param('productId') productId: string) {
    return this.productService.findTags(productId);
  }

  @Get('/:productId/properties')
  @ApiOperation({ summary: '获取产品属性列表' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findProperties(@Param('productId') productId: string) {
    return this.productService.findProperties(productId);
  }

  @Get('/:productId/events')
  @ApiOperation({ summary: '获取产品事件列表' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findEvents(@Param('productId') productId: string) {
    return this.productService.findEvents(productId);
  }

  @Get('/:productId/commands')
  @ApiOperation({ summary: '获取产品命令列表' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findCommands(@Param('productId') productId: string) {
    return this.productService.findCommands(productId);
  }

  @Get('/:productId/configs')
  @ApiOperation({ summary: '获取产品配置列表' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findConfigs(
    @Param('productId') productId: string,
    @Query('identifier') identifier: string,
  ) {
    return this.productService.findConfigs(productId, identifier);
  }
}
