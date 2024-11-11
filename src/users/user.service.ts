import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserResponse } from './user.entity';
import { v4 as uuid, validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  private excludePassword(user: User): UserResponse {
    const fields = Object.keys(user).filter((key) => key !== 'password');
    const userWithoutPassword = Object.assign(
      {},
      ...fields.map((key) => ({ [key]: user[key as keyof User] })),
    ) as UserResponse;
    return userWithoutPassword;
  }

  getUsers(): UserResponse[] {
    return this.users.map((user) => this.excludePassword(user));
  }

  private getUserWithPassword(id: string): User {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  getUser(id: string): UserResponse {
    const user = this.getUserWithPassword(id);
    return this.excludePassword(user);
  }

  createUser(userData: CreateUserDto): UserResponse {
    const { login, password } = userData;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required');
    }

    const newUser: User = {
      id: uuid(),
      login: userData.login,
      password: userData.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return this.excludePassword(newUser);
  }

  updatePassword(id: string, passwordData: UpdatePasswordDto): UserResponse {
    const { oldPassword, newPassword } = passwordData;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old and new passwords are required');
    }

    const user = this.getUserWithPassword(id);

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Incorrect old password');
    }
    user.password = passwordData.newPassword;
    user.version++;
    user.updatedAt = Date.now();
    return this.excludePassword(user);
  }

  deleteUser(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
  }
}
