import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OplogService } from './oplog.service';

@ApiTags('操作日志')
@Controller('/oplogs')
export class OplogController {
  constructor(private readonly oplogService: OplogService) {}

  @Get('/login/page')
  @ApiOperation({ summary: '获取登录日志分页数据' })
  async findLoginPage(@Query() dto: any) {
    return this.oplogService.findLoginPage(dto);
  }

  @Get('/operate/page')
  @ApiOperation({ summary: '获取操作日志分页数据' })
  async findOperatePage(@Query() dto: any) {
    return this.oplogService.findOperatePage(dto);
  }
}
