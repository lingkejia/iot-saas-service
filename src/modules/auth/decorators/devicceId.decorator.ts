import { SetMetadata } from '@nestjs/common';

export const DeviceId = (options: { from: string; key: string }) =>
  SetMetadata('deviceId', options);
