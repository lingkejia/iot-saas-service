import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  create(@Body() dto: Partial<User>): Promise<User> {
    return this.userService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: Partial<User>): Promise<User> {
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
