import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserResponse } from './user.entity';
import { User as PrismaUser } from '@prisma/client';
import { validate as uuidValidate } from 'uuid';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private convertPrismaUser(prismaUser: PrismaUser): User {
    return {
      ...prismaUser,
      createdAt: prismaUser.createdAt.getTime(),
      updatedAt: prismaUser.updatedAt.getTime(),
    };
  }

  private excludePassword(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUsers(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users
      .map((user) => this.convertPrismaUser(user))
      .map((user) => this.excludePassword(user));
  }

  private async getUserWithPassword(id: string): Promise<User> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.convertPrismaUser(user);
  }

  async getUser(id: string): Promise<UserResponse> {
    const user = await this.getUserWithPassword(id);
    return this.excludePassword(user);
  }

  async createUser(userData: AuthDto): Promise<UserResponse> {
    const { login, password } = userData;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required');
    }

    try {
      const hashedPassword = await hash(
        userData.password,
        +process.env.CRYPT_SALT,
      );

      const newUser = await this.prisma.user.create({
        data: {
          login,
          password: hashedPassword,
        },
      });

      return this.excludePassword(this.convertPrismaUser(newUser));
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Login already exists');
      }
      throw error;
    }
  }

  async updatePassword(
    id: string,
    passwordData: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const { oldPassword, newPassword } = passwordData;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old and new passwords are required');
    }

    const user = await this.getUserWithPassword(id);

    const isSamePassword = await compare(oldPassword, user.password);

    if (!isSamePassword) {
      throw new ForbiddenException('Incorrect old password');
    }

    const hashedPassword = await hash(newPassword, +process.env.CRYPT_SALT);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        version: { increment: 1 },
      },
    });

    return this.excludePassword(this.convertPrismaUser(updatedUser));
  }

  async deleteUser(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }
}
