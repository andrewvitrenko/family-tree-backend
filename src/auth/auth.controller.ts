import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { SignupDto } from '@/auth/dto/signup.dto';
import { UseLocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { UseRefreshGuard } from '@/auth/guards/refresh.guard';
import { Cookies } from '@/decorators/cookies.decorator';
import { UserData } from '@/decorators/user-data.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseLocalAuthGuard()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @UserData() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(user);
    this.setCookies(res, access_token, refresh_token);
  }

  @Post('/signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.signup(signupDto);
    this.setCookies(res, access_token, refresh_token);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Cookies('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(refresh_token);
    this.removeCookies(res);
  }

  @UseRefreshGuard()
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @UserData('userId') userId: string,
    @Cookies('refresh_token') oldToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.refresh(
      userId,
      oldToken,
    );
    this.setCookies(res, access_token, refresh_token);
  }

  private setCookies(
    res: Response,
    access_token: string,
    refresh_token: string,
  ) {
    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        signed: true,
        maxAge: 1000 * 60 * 60 * 3,
      })
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false,
        signed: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
  }

  private removeCookies(res: Response) {
    res
      .cookie('access_token', '', { maxAge: 0 })
      .cookie('refresh_token', '', { maxAge: 0 });
  }
}
