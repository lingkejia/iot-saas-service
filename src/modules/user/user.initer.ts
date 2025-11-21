import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserIniter implements OnModuleInit {
  private readonly logger = new Logger(UserIniter.name);

  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createAdmin();
    await this.createTest();
  }

  private async createAdmin() {
    const username = this.configService.get<string>('admin.username');
    const password = this.configService.get<string>('admin.password');
    const email = this.configService.get<string>('admin.email');

    try {
      // const exist = await this.userRepository.exists({
      //   where: { username },
      // });
      // if (exist) {
      //   this.logger.log(`管理员用户 ${username} 已存在，跳过初始化`);
      //   return;
      // }

      const entity = new User();
      entity.username = username;
      entity.password = password;
      entity.email = email;
      entity.role = 'admin';

      const admin = await this.userService.create(entity);

      this.logger.log(`成功创建管理员用户: ${admin.username}`);
    } catch (error) {
      this.logger.error(`创建管理员用户失败: ${error.message}`);
    }
  }

  private async createTest() {
    const username = 'test';
    const password = 'test123';
    const email = 'test@example.com';

    try {
      // const exist = await this.userRepository.exists({
      //   where: { username },
      // });
      // if (exist) {
      //   this.logger.log(`用户 ${username} 已存在，跳过初始化`);
      //   return;
      // }

      const entity = new User();
      entity.username = username;
      entity.password = password;
      entity.email = email;
      entity.role = 'user';
      // entity.deviceIds = [];

      const user = await this.userService.create(entity);

      this.logger.log(`成功创建用户: ${user.username}`);
    } catch (error) {
      this.logger.error(`创建用户失败: ${error.message}`);
    }
  }
}
