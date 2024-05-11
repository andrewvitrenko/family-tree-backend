import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { SignupDto } from '@/auth/dto/signup.dto';
import { AuthResponse } from '@/auth/types';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  login(user: User) {
    return this.getTokens(user.id);
  }

  async signup(signupDto: SignupDto) {
    const user = await this.userService.create(signupDto);

    return this.getTokens(user.id);
  }

  private getTokens(userId: string): AuthResponse {
    const access_token = this.jwtService.sign({ userId });

    return { access_token };
  }
}
