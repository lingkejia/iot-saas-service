import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/external.module';
import { JobService } from './job.service';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [ExternalModule, DeviceModule],
  // controllers: [],
  providers: [JobService],
  // exports: [],
})
export class JobModule {}
