import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IotService } from './iot.service';
import { WeixinService } from './weixin.service';

@Module({
  imports: [HttpModule],
  // controllers: [],
  providers: [IotService, WeixinService],
  exports: [IotService, WeixinService],
})
export class ExternalModule {}
