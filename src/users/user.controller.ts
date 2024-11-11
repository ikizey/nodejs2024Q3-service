import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';
import { UserResponse } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserResponse[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.getUser(id);
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<UserResponse> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() passwordData: UpdatePasswordDto,
  ): Promise<UserResponse> {
    return this.userService.updatePassword(id, passwordData);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    this.userService.deleteUser(id);
  }
}
