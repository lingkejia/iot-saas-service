import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度必须在3-50个字符之间' })
  username: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
  })
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'user', 'operator'], {
    message: '角色必须是admin、user或operator之一',
  })
  role?: string;

  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: '电话号码必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '电话号码格式不正确' })
  phoneNumber?: string;
}
