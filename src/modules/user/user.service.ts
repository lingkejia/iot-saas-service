import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: Partial<User>): Promise<User> {
    // 检查用户名是否已存在
    const existUsername = await this.usersRepository.exists({
      where: { username: dto.username },
    });
    if (existUsername) {
      throw new BadRequestException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existEmail = await this.usersRepository.exists({
      where: { email: dto.email },
    });
    if (existEmail) {
      throw new BadRequestException('邮箱已存在');
    }

    const entity = this.usersRepository.create(dto);
    
    return this.usersRepository.save(entity);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const model = await this.usersRepository.findOne({ where: { id } });
    if (!model) {
      throw new NotFoundException(`用户ID:${id}不存在`);
    }

    return model;
  }

  async findByUsername(username: string): Promise<User> {
    const model = await this.usersRepository.findOne({ where: { username } });
    if (!model) {
      throw new NotFoundException(`用户名:${username}不存在`);
    }

    return model;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const model = await this.findOne(id);
    Object.assign(model, dto);
    return this.usersRepository.save(model);
  }

  async remove(id: string): Promise<void> {
    const model = await this.findOne(id);
    await this.usersRepository.remove(model);
  }
}
