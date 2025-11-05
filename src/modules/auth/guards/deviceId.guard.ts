import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DeviceIdGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireOptions = this.reflector.getAllAndOverride<any>('deviceId', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const deviceId = request[requireOptions.from][requireOptions.key];

    if (!deviceId) {
      return true;
    }

    const deviceIds = request.user.deviceIds ?? [];

    if (deviceIds.length > 0 && !deviceIds.includes(deviceId)) {
      throw new ForbiddenException('您没有权限访问');
    }

    return true;
  }
}
