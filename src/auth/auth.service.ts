import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';

import { SignupDto } from '@/auth/dto/signup.dto';
import { AuthResponse } from '@/auth/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  login(user: User) {
    return this.getTokens(user.id);
  }

  async signup({
    email,
    birthDate,
    firstName,
    lastName,
    password,
    sex,
  }: SignupDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: await hash(password, await genSalt()),
        person: {
          create: {
            sex,
            birthDate: new Date(birthDate).toISOString(),
            lastName,
            firstName,
          },
        },
      },
    });

    return this.getTokens(user.id);
  }

  private getTokens(userId: number): AuthResponse {
    const access_token = this.jwtService.sign({ userId });

    return { access_token };
  }
}
