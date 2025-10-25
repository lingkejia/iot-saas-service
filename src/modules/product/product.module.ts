import { Module } from '@nestjs/common';
import { ExternalModule } from '../external/external.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [ExternalModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
