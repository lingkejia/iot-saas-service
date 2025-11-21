import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/wx-login')
  async wxLogin(@Body() dto: any) {
    return await this.authService.wxLogin(dto);
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

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() dto: any, @Req() req: any) {
    return this.authService.changePassword(dto, req.user);
  }

  @Patch('/change-wxbind')
  @UseGuards(JwtAuthGuard)
  async changeWxBind(@Body() dto: any, @Req() req: any) {
    return this.authService.changeWxBind(dto, req.user);
  }
}
