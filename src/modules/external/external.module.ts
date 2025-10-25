import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IotService } from './iot.service';

@Module({
  imports: [HttpModule],
  // controllers: [],
  providers: [IotService],
  exports: [IotService],
})
export class ExternalModule {}
