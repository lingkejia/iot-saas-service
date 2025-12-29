import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oplog } from './entities/oplog.entity';
import { OplogController } from './oplog.controller';
import { OplogService } from './oplog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Oplog])],
  providers: [OplogService],
  controllers: [OplogController],
  exports: [OplogService],
})
export class OplogModule {}
