import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WeixinService } from '../external/weixin.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private weixinService: WeixinService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByUsername(username);
      const validate = await this.userService.validatePassword(
        password,
        user.password,
      );
      if (validate) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        // email: user.email,
        role: user.role,
      },
    };
  }

  async wxLogin(dto: any) {
    const { code } = dto;
    const openid = await this.weixinService.getOpenId(code);

    if (!openid) {
      throw new UnauthorizedException('微信小程序登录失败，无法获取openid');
    }

    const user = await this.userService.findByOpenId(openid);

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        // email: user.email,
        role: user.role,
        // wxOpenId: user.wxOpenId,
      },
    };
  }

  async register(userData: Partial<User>) {
    // 直接委托给 UsersService 创建用户
    const newUser = await this.userService.create(userData as any);
    const { password, ...result } = newUser;
    return result;
  }

  async changePassword(dto: any, user: any) {
    const { oldPassword, password } = dto;
    const current = await this.userService.findOne(user.id);
    const validate = await this.userService.validatePassword(
      oldPassword,
      current.password,
    );
    if (!validate) {
      throw new BadRequestException('旧密码错误');
    }

    return this.userService.update(user.id, { password });
  }

  async changeWxBind(dto: any, user: any) {
    const { code } = dto;
    const openid = await this.weixinService.getOpenId(code);
    if (!openid) {
      throw new UnauthorizedException('微信小程序登录失败，无法获取openid');
    }

    return this.userService.update(user.id, { wxOpenId: openid });
  }
}
