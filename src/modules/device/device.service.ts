import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IotService } from '../external/iot.service';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    private iotService: IotService,
  ) {}

  async save(entities: Device[]): Promise<Device[]> {
    return this.deviceRepository.save(entities);
  }

  async findAll(query: any, user: any): Promise<Device[]> {
    const where = {
      name: query.name,
      devId: query.devId,
      online: query.online,
      deviceId: null,
    };

    if (user.deviceIds) {
      where.deviceId = In(user.deviceIds);
    }

    // const page = query.page ?? 1;
    // const pageSize = query.pageSize ?? 10;

    const items = await this.deviceRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
      // skip: (page - 1) * pageSize,
      // take: pageSize,
    });

    return items;
  }

  async findOne(deviceId: string, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDevice(deviceId);
    return response.data;
  }

  async update(deviceId: string, dto: any, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    await this.deviceRepository.update({ deviceId }, dto);

    const response = await this.iotService.updateDevice(deviceId, dto);
    return response.data;
  }

  async findTag(deviceId: string, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDeviceTag(deviceId);
    return response.data;
  }

  async findProperty(deviceId: string, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDeviceProperty(deviceId);
    return response.data;
  }

  async findProperties(deviceId: string, query: any, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDeviceProperties(deviceId, query);
    return response.data;
  }

  async findEvents(deviceId: string, query: any, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDeviceEvents(deviceId, query);
    return response.data;
  }

  async findCommands(deviceId: string, query: any, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDeviceCommands(deviceId, query);
    return response.data;
  }

  async sendCommand(deviceId: string, dto: any, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.sendDeviceCommand(deviceId, dto);
    return response.data;
  }

  async findConfig(deviceId: string, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDeviceConfig(deviceId);
    return response.data;
  }

  async findConfigs(deviceId: string, query: any, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.getDeviceConfigs(deviceId, query);
    return response.data;
  }

  async sendConfig(deviceId: string, dto: any, user: any) {
    if (user.deviceIds && !user.deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    const response = await this.iotService.sendDeviceConfig(deviceId, dto);
    return response.data;
  }
}
