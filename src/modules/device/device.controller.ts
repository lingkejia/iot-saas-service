import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeviceId } from '../auth/decorators/devicceId.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { DeviceIdGuard } from '../auth/guards/deviceId.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { DeviceService } from './device.service';

@ApiTags('设备管理')
@ApiBearerAuth()
@Controller('/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @ApiOperation({ summary: '获取设备列表' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'user')
  findAll(@Query() query: any, @Req() req: any) {
    return this.deviceService.findAll(query, req.user);
  }

  @Get('/:deviceId')
  @ApiOperation({ summary: '获取设备详情' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findOne(@Param('deviceId') deviceId: string, @Req() req: any) {
    return this.deviceService.findOne(deviceId, req.user);
  }

  @Patch('/:deviceId')
  @ApiOperation({ summary: '更新设备' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  update(
    @Param('deviceId') deviceId: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.deviceService.update(deviceId, dto, req.user);
  }

  @Get('/:deviceId/tag')
  @ApiOperation({ summary: '获取设备标签' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findTag(@Param('deviceId') deviceId: string, @Req() req: any) {
    return this.deviceService.findTag(deviceId, req.user);
  }

  @Get('/:deviceId/property')
  @ApiOperation({ summary: '获取设备属性' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findProperty(@Param('deviceId') deviceId: string, @Req() req: any) {
    return this.deviceService.findProperty(deviceId, req.user);
  }

  @Get('/:deviceId/properties')
  @ApiOperation({ summary: '获取设备属性历史' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findProperties(
    @Param('deviceId') deviceId: string,
    @Query() query: any,
    @Req() req: any,
  ) {
    return this.deviceService.findProperties(deviceId, query, req.user);
  }

  @Get('/:deviceId/events')
  @ApiOperation({ summary: '获取设备事件历史' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findEvents(
    @Param('deviceId') deviceId: string,
    @Query() query: any,
    @Req() req: any,
  ) {
    return this.deviceService.findEvents(deviceId, query, req.user);
  }

  @Get('/:deviceId/commands')
  @ApiOperation({ summary: '获取设备命令记录' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findCommands(
    @Param('deviceId') deviceId: string,
    @Query() query: any,
    @Req() req: any,
  ) {
    return this.deviceService.findCommands(deviceId, query, req.user);
  }

  @Post('/:deviceId/command')
  @ApiOperation({ summary: '发送设备命令' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  sendCommand(
    @Param('deviceId') deviceId: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.deviceService.sendCommand(deviceId, dto, req.user);
  }

  @Get('/:deviceId/config')
  @ApiOperation({ summary: '获取设备配置' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findConfig(
    @Param('deviceId') deviceId: string,
    @Query('identifier') identifier: string,
    @Req() req: any,
  ) {
    return this.deviceService.findConfig(deviceId, identifier, req.user);
  }

  @Get('/:deviceId/configs')
  @ApiOperation({ summary: '获取设备配置记录' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  findConfigs(
    @Param('deviceId') deviceId: string,
    @Query() query: any,
    @Req() req: any,
  ) {
    return this.deviceService.findConfigs(deviceId, query, req.user);
  }

  @Post('/:deviceId/config')
  @ApiOperation({ summary: '发送设备配置' })
  @UseGuards(JwtAuthGuard, RoleGuard, DeviceIdGuard)
  @Roles('admin', 'user')
  @DeviceId({ from: 'params', key: 'deviceId' })
  sendConfig(
    @Param('deviceId') deviceId: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.deviceService.sendConfig(deviceId, dto, req.user);
  }
}
