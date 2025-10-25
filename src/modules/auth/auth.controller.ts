import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.register(createUserDto);
  // }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() dto: any, @Req() req: any) {
    return this.authService.changePassword(dto, req.user);
  }
}
