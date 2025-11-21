import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: Partial<User>): Promise<User> {
    // 检查用户名是否已存在
    const existUsername = await this.userRepository.exists({
      where: { username: dto.username },
    });
    if (existUsername) {
      throw new BadRequestException(`用户名[${dto.username}]已存在`);
    }

    if (dto.email) {
      // 检查邮箱是否已存在
      const existEmail = await this.userRepository.exists({
        where: { email: dto.email },
      });
      if (existEmail) {
        throw new BadRequestException(`邮箱[${dto.email}]已存在`);
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const entity = this.userRepository.create(dto);

    return this.userRepository.save(entity);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const model = await this.userRepository.findOne({ where: { id } });
    if (!model) {
      throw new NotFoundException(`用户ID[${id}]不存在`);
    }

    return model;
  }

  async findByUsername(username: string): Promise<User> {
    const model = await this.userRepository.findOne({ where: { username } });
    if (!model) {
      throw new NotFoundException(`用户名[${username}]不存在`);
    }

    return model;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByOpenId(wxOpenId: string): Promise<User> {
    const model = await this.userRepository.findOne({
      where: { wxOpenId },
    });

    if (!model) {
      throw new NotFoundException(`wxOpenID[${wxOpenId}]不存在`);
    }

    return model;
  }

  async update(id: string, dto: Partial<User>) {
    const model = await this.findOne(id);
    // Object.assign(model, dto);
    // return this.userRepository.save(model);

    if (dto.username && dto.username !== model.username) {
      // 检查用户名是否已存在
      const existUsername = await this.userRepository.exists({
        where: { username: dto.username },
      });
      if (existUsername) {
        throw new BadRequestException(`用户名[${dto.username}]已存在`);
      }
    }

    if (dto.email && dto.email !== model.email) {
      // 检查邮箱是否已存在
      const existEmail = await this.userRepository.exists({
        where: { email: dto.email },
      });
      if (existEmail) {
        throw new BadRequestException(`邮箱[${dto.email}]已存在`);
      }
    }

    if (dto.password && dto.password !== model.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepository.update(id, dto);
  }

  async remove(id: string) {
    // const model = await this.findOne(id);
    // await this.userRepository.remove(model);
    return this.userRepository.delete(id);
  }

  async validatePassword(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword);
  }
}
