import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { RefreshStrategy } from '@/auth/strategies/refresh.strategy';
import { PrismaModule } from '@/prisma/prisma.module';
import { ENV } from '@/types/common';
import { UsersModule } from '@/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        signOptions: { expiresIn: '3h' },
        secret: configService.get<string>(ENV.ACCESS_TOKEN_SECRET),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    TokenService,
  ],
})
export class AuthModule {}
