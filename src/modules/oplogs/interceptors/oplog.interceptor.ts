import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { getIp } from '../../../common/utils/web.util';
import {
  OplogKey,
  OplogOption,
  OplogType,
} from '../decorators/oplog.decorator';
import { Oplog } from '../entities/oplog.entity';
import { OplogService } from '../oplog.service';
// import { GeoLocationService } from 'src/modules/external/geo-location.service';

// 全局操作日志切面拦截
@Injectable()
export class OplogInterceptor implements NestInterceptor {
  private readonly MESSAGE_MAX_LENGTH = 500;
  private readonly TEXT_MAX_LENGTH = 65535;

  constructor(
    private readonly reflector: Reflector,
    private readonly oplogService: OplogService,
    // private readonly geoLocationService: GeoLocationService,
    private readonly jwtService: JwtService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const oplog = this.reflector.getAllAndOverride<OplogOption>(OplogKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const now = Date.now();

    return next.handle().pipe(
      catchError((err) => {
        this.afterHandle(oplog, request, now, Date.now(), err, null);
        return throwError(() => err);
      }),
      tap((result) => {
        this.afterHandle(oplog, request, now, Date.now(), null, result);
      }),
    );
  }

  async afterHandle(
    oplog: OplogOption,
    request: any,
    beginTime: number,
    endTime: number,
    err: any,
    result: any,
  ) {
    if (!oplog) {
      return;
    }

    const log = new Oplog();

    log.title = oplog.title;
    log.type = oplog.type;
    log.url = request.url;
    log.ip = getIp(request);

    // try {
    //   const geoContent = await this.geoLocationService.getContentByIp(log.ip);
    //   log.location = geoContent?.address;
    // } catch (error) {
    //   console.error('获取IP位置失败：', error.message);
    // }

    log.userAgent = request.headers['user-agent'];
    log.beginTime = new Date(beginTime);
    log.duration = endTime - beginTime;
    log.status = HttpStatus.OK;
    log.message = '请求成功';

    const args = {
      params: request.params,
      query: request.query,
      body: request.body,
    };

    log.requestParam = JSON.stringify(args);

    if (result) {
      log.status = result.code;
      log.message = result.message;
      log.responseResult = JSON.stringify(result);
    }

    const loginUser = await this.getLoginUser(request);
    if (loginUser) {
      log.username = loginUser.username;
    } else if (oplog.type === OplogType.Login) {
      log.username = args.body.username;
    }

    if (err) {
      log.status = err.status;
      log.message = err.message;
      log.stack = err.stack;
    }

    if (log.requestParam && log.requestParam.length > this.TEXT_MAX_LENGTH) {
      log.requestParam = log.requestParam.substring(0, this.TEXT_MAX_LENGTH);
    }

    if (
      log.responseResult &&
      log.responseResult.length > this.TEXT_MAX_LENGTH
    ) {
      log.responseResult = log.responseResult.substring(
        0,
        this.TEXT_MAX_LENGTH,
      );
    }

    if (log.message && log.message.length > this.MESSAGE_MAX_LENGTH) {
      log.message = log.message.substring(0, this.MESSAGE_MAX_LENGTH);
    }

    if (log.stack && log.stack.length > this.TEXT_MAX_LENGTH) {
      log.stack = log.stack.substring(0, this.TEXT_MAX_LENGTH);
    }

    if (log.userAgent && log.userAgent.length > this.TEXT_MAX_LENGTH) {
      log.userAgent = log.userAgent.substring(0, this.TEXT_MAX_LENGTH);
    }

    await this.oplogService.create(log);
  }

  private async getLoginUser(request: any) {
    // 由于先执行 AuthGuard 此处可以使用 request.user
    if (request.user) {
      return request.user;
    }

    const token = request['access_token'];
    if (token) {
      return this.jwtService.verifyAsync(token);
    }

    return null;
  }
}
