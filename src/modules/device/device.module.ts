import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalModule } from '../external/external.module';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    // UserModule,
    ExternalModule,
    // forwardRef(() => MqttModule),
    // forwardRef(() => AlarmsModule),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
