import { SetMetadata } from '@nestjs/common';

export const OplogKey = 'oplog';

export enum OplogType {
  Login = 0,
  Logout = 1,
  Create = 2,
  Delete = 3,
  Update = 4,
  Query = 5,
  Other = 99,
}

export class OplogOption {
  title: string;
  type: OplogType;
  // DTO类型，请求使用的DTO类型
  // dtoType?: Type<any>;
  // 实体服务类型
  // entityServiceType?: Type<any>;
  // 实体ID参数名，默认为id
  // entityIdParam?: string;
}

export const Oplogs = (option: OplogOption) => SetMetadata(OplogKey, option);
