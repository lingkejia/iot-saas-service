import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty({ message: '设备名称不能为空' })
  @IsString({ message: '设备名称必须是字符串' })
  @Length(2, 50, { message: '设备名称长度必须在2-50个字符之间' })
  name: string;

  @IsNotEmpty({ message: '设备ID不能为空' })
  @IsString({ message: '设备ID必须是字符串' })
  @Length(2, 100, { message: '设备ID长度必须在2-100个字符之间' })
  deviceId: string;

  @IsOptional()
  @IsEnum(['gateway', 'device'], {
    message: '设备类型必须是gateway、device之一',
  })
  type?: string;

  @IsOptional()
  @IsString({ message: '位置信息必须是字符串' })
  location?: string;

  @IsOptional()
  @IsString({ message: '分组ID必须是字符串' })
  groupId?: string;

  @IsOptional()
  @IsString({ message: '产品ID必须是字符串' })
  productId?: string;

  @IsOptional()
  @IsString({ message: '固件版本必须是字符串' })
  firmwareVersion?: string;
}
