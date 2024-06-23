import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '@/prisma/prisma.service';
import { ENV } from '@/types/common';

import { TokenPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.fromCookies]),
      secretOrKey: configService.get<string>(ENV.ACCESS_TOKEN_SECRET),
    });
  }

  async validate({ sub: userId }: TokenPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return { userId };
  }

  private static fromCookies(req: Request): string | null {
    const cookies = req.signedCookies;
    return cookies.access_token ?? null;
  }
}
