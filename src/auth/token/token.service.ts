import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';

import { TokenPayload, Tokens } from '@/auth/types';
import { ENV } from '@/types/common';
import { UsersService } from '@/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async createTokens(userId: string): Promise<Tokens> {
    const tokens = this.generateTokens(userId);

    await this.addToken(userId, tokens.refresh_token);
    return tokens;
  }

  async removeTokens(userId: string, refresh_token: string): Promise<void> {
    const tokens = await this.getUserTokens(userId);

    await this.userService.updateRefreshTokens(
      userId,
      tokens.filter(async (token) => !(await compare(refresh_token, token))),
    );
  }

  decode(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get<string>(ENV.REFRESH_TOKEN_SECRET),
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private generateTokens(userId: string): Tokens {
    const access_token = this.jwtService.sign({ sub: userId });
    const refresh_token = this.jwtService.sign(
      { sub: userId },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>(ENV.REFRESH_TOKEN_SECRET),
      },
    );

    return { access_token, refresh_token };
  }

  private async addToken(userId: string, token: string): Promise<void> {
    const tokens = await this.getUserTokens(userId);

    await this.userService.updateRefreshTokens(userId, [
      ...tokens,
      await hash(token, await genSalt()),
    ]);
  }

  private async getUserTokens(userId: string): Promise<string[]> {
    const tokens = await this.userService.getRefreshTokens(userId);

    return tokens.filter((token) => {
      try {
        this.jwtService.verify(token);
        return true;
      } catch (e) {
        return false;
      }
    });
  }
}
