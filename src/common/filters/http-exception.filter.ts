import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OplogType } from 'src/modules/oplogs/decorators/oplog.decorator';
import { Oplog } from 'src/modules/oplogs/entities/oplog.entity';
import { OplogService } from 'src/modules/oplogs/oplog.service';
import { getIp } from '../utils/web.util';
// import { GeoLocationService } from 'src/modules/external/geo-location.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // 获取异常信息
    let message = 'Internal server error';
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && exceptionResponse.message) {
      message = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message[0]
        : exceptionResponse.message;
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    // 统一的错误响应格式
    const responseBody = {
      code: status,
      data: null,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  private readonly FILTER_URL = ['/api/auth/login'];
  private readonly MESSAGE_MAX_LENGTH = 500;
  private readonly TEXT_MAX_LENGTH = 65535;

  constructor(
    // private readonly geoLocationService: GeoLocationService,
    private readonly oplogService: OplogService,
  ) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 对于非 HTTP 异常，使用 500 内部服务器错误
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 获取异常信息
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && exceptionResponse.message) {
        message = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message[0]
          : exceptionResponse.message;
      }
    } else if (exception && exception.message) {
      message = exception.message;
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    try {
      await this.oplog(request, status, message);
    } catch {}

    // 统一的错误响应格式
    const responseBody = {
      code: status,
      data: null,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseBody);
  }

  async oplog(request: Request, status: HttpStatus, message: string) {
    if (!this.FILTER_URL.includes(request.url)) {
      return;
    }

    const log = new Oplog();

    log.title = '登录';
    log.type = OplogType.Login;
    log.url = request.url;
    log.ip = getIp(request);

    // try {
    //   const geoContent = await this.geoLocationService.getContentByIp(log.ip);
    //   log.location = geoContent?.address;
    // } catch (error) {
    //   console.error('获取IP位置失败：', error.message);
    // }

    log.userAgent = request.headers['user-agent'];
    log.beginTime = new Date();
    log.duration = 0;
    log.status = status;
    log.message = message;

    const args = {
      params: request.params,
      query: request.query,
      body: request.body,
    };

    log.requestParam = JSON.stringify(args);

    if (request.user) {
      log.username = request.user['username'];
    } else if (args.body && args.body.username) {
      log.username = args.body.username;
    }

    if (log.requestParam && log.requestParam.length > this.TEXT_MAX_LENGTH) {
      log.requestParam = log.requestParam.substring(0, this.TEXT_MAX_LENGTH);
    }

    if (log.message && log.message.length > this.MESSAGE_MAX_LENGTH) {
      log.message = log.message.substring(0, this.MESSAGE_MAX_LENGTH);
    }

    if (log.userAgent && log.userAgent.length > this.TEXT_MAX_LENGTH) {
      log.userAgent = log.userAgent.substring(0, this.TEXT_MAX_LENGTH);
    }

    await this.oplogService.create(log);
  }
}
