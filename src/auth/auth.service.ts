import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { SignupDto } from '@/auth/dto/signup.dto';
import { TokenService } from '@/auth/token/token.service';
import { Tokens } from '@/auth/types';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  login(user: User): Promise<Tokens> {
    return this.tokenService.createTokens(user.id);
  }

  async signup(signupDto: SignupDto): Promise<Tokens> {
    const user = await this.userService.create(signupDto);
    return this.tokenService.createTokens(user.id);
  }

  logout(refresh_token: string): Promise<void> {
    if (!refresh_token) return;

    const { sub: userId } = this.tokenService.decode(refresh_token);

    return this.tokenService.removeTokens(userId, refresh_token);
  }

  async refresh(userId: string, oldToken: string): Promise<Tokens> {
    await this.tokenService.removeTokens(userId, oldToken);
    return this.tokenService.createTokens(userId);
  }
}
