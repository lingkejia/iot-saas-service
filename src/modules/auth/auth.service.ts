import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WeixinService } from '../external/weixin.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private weixinService: WeixinService,
  ) {}

  // 验证用户及密码
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

  // 登录
  async login(user: any) {
    await this.updateLoginTime(user);
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
        role: user.role,
      }),
      refresh_token: this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
      user: {
        id: user.id,
        username: user.username,
        // email: user.email,
        role: user.role,
      },
    };
  }

  // 刷新令牌
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new BadRequestException('无效的刷新令牌');
      }

      await this.updateLoginTime(user);

      return {
        access_token: this.jwtService.sign({
          username: user.username,
          sub: user.id,
          role: user.role,
        }),
        refresh_token: this.jwtService.sign(
          { sub: user.id },
          {
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
          },
        ),
        user: {
          id: user.id,
          username: user.username,
          // email: user.email,
          role: user.role,
        },
      };
    } catch (e) {
      throw new BadRequestException('令牌刷新失败');
    }
  }

  // 微信小程序登录
  async wxLogin(dto: any) {
    const { code } = dto;
    const openid = await this.weixinService.getOpenId(code);
    if (!openid) {
      throw new UnauthorizedException('微信登录验证失败，请稍后重试');
    }

    const user = await this.userService.findByOpenId(openid);

    await this.updateLoginTime(user);

    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
        role: user.role,
      }),
      refresh_token: this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
      user: {
        id: user.id,
        username: user.username,
        // email: user.email,
        role: user.role,
        // wxOpenId: user.wxOpenId,
      },
    };
  }

  // 更新登录时间
  private async updateLoginTime(user: any) {
    return this.userService.update(user.id, { loginAt: new Date() });
  }

  // async register(userData: Partial<User>) {
  //   const newUser = await this.userService.create(userData as any);
  //   const { password, ...result } = newUser;
  //   return result;
  // }

  // 修改密码
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

  // 微信小程序绑定
  async changeWxBind(dto: any, user: any) {
    const { code } = dto;
    const openid = await this.weixinService.getOpenId(code);
    if (!openid) {
      throw new UnauthorizedException('微信小程序绑定失败，无法获取openid');
    }

    return this.userService.update(user.id, { wxOpenId: openid });
  }
}
