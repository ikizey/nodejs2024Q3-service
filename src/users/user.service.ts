import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './user.entity';
import { v4 as uuid, validate as uuidValidate } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }

  getUser(id: string): User {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  createUser(userData: CreateUserDto): User {
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
    return newUser;
  }

  updatePassword(id: string, passwordData: UpdatePasswordDto): User {
    const { oldPassword, newPassword } = passwordData;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old and new passwords are required');
    }
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const user = this.getUser(id);
    if (user.password !== oldPassword) {
      throw new UnauthorizedException('Incorrect old password');
    }
    user.password = passwordData.newPassword;
    user.version++;
    user.updatedAt = Date.now();
    return user;
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
