import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '@/auth/types';
import { PrismaService } from '@/prisma/prisma.service';
import { ENV } from '@/types/common';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshStrategy.extractFromCookies,
      ]),
      secretOrKey: configService.get<string>(ENV.REFRESH_TOKEN_SECRET),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { sub: userId }: TokenPayload) {
    const refresh_token = req.signedCookies.refresh_token;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const userTokens = user.refreshTokens;

    const isExistingToken = !!userTokens.find(
      async (token) => await compare(refresh_token, token),
    );

    if (!isExistingToken) {
      throw new UnauthorizedException();
    }

    return { userId };
  }

  private static extractFromCookies(req: Request): string | null {
    const cookies = req.signedCookies;
    return cookies.refresh_token ?? null;
  }
}
