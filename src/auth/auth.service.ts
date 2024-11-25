import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { decode, JwtPayload } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface AuthPayload extends JwtPayload {
  userId: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly storage: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(authData: AuthDto) {
    return this.usersService.createUser(authData);
  }

  async login(authData: AuthDto) {
    const user = await this.storage.user.findFirst({
      where: { login: authData.login },
    });
    if (!user) {
      throw new ForbiddenException(
        `User with login ${authData.login} does not exist`,
      );
    }
    const isSamePassword = await compare(authData.password, user.password);

    if (!isSamePassword) {
      throw new ForbiddenException(
        `Password for user ${authData.login} is incorrect`,
      );
    }

    const authPayload = { userId: user.id, login: user.login };
    return this.generateTokens(authPayload);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      await this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch {
      throw new ForbiddenException('Refresh token invalid');
    }

    const { userId, login } = decode(
      refreshTokenDto.refreshToken,
    ) as AuthPayload;
    return this.generateTokens({ userId, login });
  }

  private async generateTokens(payload: AuthPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }
}
