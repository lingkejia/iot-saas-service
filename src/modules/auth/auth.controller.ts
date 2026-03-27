import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Oplogs, OplogType } from '../oplogs/decorators/oplog.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Oplogs({ title: '登录', type: OplogType.Login })
  @Post('/login')
  async login(@Req() req: any) {
    const result = await this.authService.login(req.user);

    // 为了登录日志
    req['access_token'] = result.access_token;

    return result;
  }

  @Oplogs({ title: '刷新令牌', type: OplogType.Login })
  @Post('/refresh')
  async refresh(@Body('refresh_token') refreshToken: string, @Req() req: any) {
    const result = await this.authService.refreshToken(refreshToken);

    // 为了登录日志
    req['access_token'] = result.access_token;

    return result;
  }

  @Oplogs({ title: '微信小程序登录', type: OplogType.Login })
  @Post('/wx-login')
  async wxLogin(@Body() dto: any, @Req() req: any) {
    const result = await this.authService.wxLogin(dto);

    // 为了登录日志
    req['access_token'] = result.access_token;

    return result;
  }

  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.register(createUserDto);
  // }

  @Get('/info')
  @UseGuards(JwtAuthGuard)
  async getInfo(@Req() req: any) {
    return req.user;
  }

  // 退出登录
  @Oplogs({ title: '退出登录', type: OplogType.Logout })
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    return true;
  }

  @Oplogs({ title: '修改密码', type: OplogType.Update })
  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() dto: any, @Req() req: any) {
    return this.authService.changePassword(dto, req.user);
  }

  @Oplogs({ title: '微信小程序绑定', type: OplogType.Update })
  @Patch('/change-wxbind')
  @UseGuards(JwtAuthGuard)
  async changeWxBind(@Body() dto: any, @Req() req: any) {
    return this.authService.changeWxBind(dto, req.user);
  }
}
