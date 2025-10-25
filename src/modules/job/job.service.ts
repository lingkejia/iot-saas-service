import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { DeviceService } from '../device/device.service';
import { IotService } from '../external/iot.service';
import { Device } from '../device/entities/device.entity';

@Injectable()
export class JobService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly iotService: IotService,
    private readonly deviceService: DeviceService,
  ) {}

  onModuleInit() {
    // 立即同步
    this.syncDevices();
  }

  // 同步设备列表，每分钟执行一次
  @Cron('0 * * * * *')
  async syncDevices() {
    try {
      const response = await this.iotService.getDevices({});
      const deviceEntities = [];

      response.data.forEach(async (device: any) => {
        const entity = new Device();
        entity.name = device.name;
        entity.deviceId = device.id;
        entity.devId = device.deviceId;
        entity.productId = device.productId;
        entity.firmwareVersion = device.firmwareVersion;
        entity.location = device.location;
        entity.online = device.online;
        entity.lastOnlineAt = device.lastOnlineAt;

        deviceEntities.push(entity);
      });

      await this.deviceService.save(deviceEntities);
    } catch (error) {
      console.error('同步设备列表失败:', error.message);
    }
  }
}
