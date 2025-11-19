import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByUsername(username);
      if (user && (await user.validatePassword(password))) {
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
        email: user.email,
        role: user.role,
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
    if (!(await current.validatePassword(oldPassword))) {
      throw new BadRequestException('旧密码错误');
    }

    return this.userService.update(user.id, { password });
  }
}
