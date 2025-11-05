import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
} from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 配置CORS
  app.enableCors();

  // 配置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 配置全局过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('IoT业务平台API')
    .setDescription('物联网业务平台API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 从配置服务获取端口
  const port = configService.get<number>('port', 3100);
  await app.listen(port);
  console.log(`应用程序已启动，访问: http://localhost:${port}`);
}
bootstrap();
