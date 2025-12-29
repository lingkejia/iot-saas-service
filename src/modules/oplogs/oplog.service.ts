import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, Repository } from 'typeorm';
import { Oplog } from './entities/oplog.entity';
import { OplogType } from './decorators/oplog.decorator';

@Injectable()
export class OplogService implements OnModuleInit {
  constructor(
    @InjectRepository(Oplog)
    private oplogRepository: Repository<Oplog>,
  ) {}

  async onModuleInit() {}

  async findLoginPage(query: any) {
    const where: FindOptionsWhere<Oplog> = {
      type: In([OplogType.Login, OplogType.Logout]),
    };

    if (query.beginTime && query.endTime) {
      where.createdAt = Between(query.beginTime, query.endTime);
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [records, total] = await this.oplogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      records,
      total,
    };
  }

  async findOperatePage(query: any) {
    const where: FindOptionsWhere<Oplog> = {
      type: In([
        OplogType.Create,
        OplogType.Delete,
        OplogType.Update,
        OplogType.Query,
        OplogType.Other,
      ]),
    };

    if (query.beginTime && query.endTime) {
      where.createdAt = Between(query.beginTime, query.endTime);
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [records, total] = await this.oplogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      records,
      total,
    };
  }

  async create(dto: any) {
    const record = this.oplogRepository.create(dto);
    return this.oplogRepository.save(record);
  }
}
