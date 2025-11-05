import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { DeviceService } from '../device/device.service';
import { Device } from '../device/entities/device.entity';
import { IotService } from '../external/iot.service';

@Injectable()
export class JobService implements OnModuleInit {
  private readonly logger = new Logger(JobService.name);

  private updatedAt: Date = null;

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
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // 整点重置
        this.updatedAt = null;
      }

      // 获取本地设备列表
      const locals = await this.deviceService.findAll({}, {});

      const pageSize = this.configService.get<number>('job.syncDevicePageSize');

      let page = 1;
      let updatedAt: Date = null;
      let fetch = 0;

      const entities = [];

      while (true) {
        this.logger.log(
          `page: ${page}, pageSize: ${pageSize}, updatedAt: ${this.updatedAt?.toISOString() ?? null}`,
        );

        // 获取远程设备列表
        const response = await this.iotService.getDevices({
          page,
          pageSize,
          updatedAt: this.updatedAt?.toISOString() ?? null,
        });

        const { list, total } = response.data;

        this.logger.log(`list: ${list.length}, total: ${total}`);

        fetch += list.length;

        list.forEach(async (remote: any) => {
          const deviceId = remote.id;
          const entity = new Device();

          const local = locals.find((item) => item.deviceId === deviceId);
          if (local && this.updatedAt !== null) {
            entity.id = local.id;
          }

          entity.name = remote.name;
          entity.deviceId = deviceId;
          entity.devId = remote.deviceId;
          entity.productId = remote.productId;
          entity.firmwareVersion = remote.firmwareVersion;
          entity.location = remote.location;
          entity.online = remote.online;
          entity.lastOnlineAt = remote.lastOnlineAt;
          entity.dataUpdatedAt = remote.dataUpdatedAt;
          entity.creAt = remote.createdAt;

          entities.push(entity);

          if (
            updatedAt === null ||
            updatedAt.getTime() < new Date(remote.updatedAt).getTime()
          ) {
            updatedAt = new Date(remote.updatedAt);
          }
        });

        if (fetch >= total) {
          // 跳出循环
          break;
        }

        // 下一页
        page++;

        // 等待1秒继续
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      this.logger.log(
        `entities: ${entities.length}, updatedAt: ${updatedAt?.toISOString() ?? null}`,
      );

      if (this.updatedAt === null) {
        await this.deviceService.deleteAll();
      }

      if (entities.length > 0) {
        await this.deviceService.save(entities);
      }

      this.updatedAt = updatedAt;
    } catch (error) {
      this.logger.error(`同步设备列表失败: ${error.message}`);
    }
  }
}
