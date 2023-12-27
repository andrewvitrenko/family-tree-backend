import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from '@/auth/auth.service';
import { SignupDto } from '@/auth/dto/signup.dto';
import { GetUserData } from '@/decorators/get-user-data.decorator';
import { UseLocalAuthGuard } from '@/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseLocalAuthGuard()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@GetUserData() user: User) {
    return this.authService.login(user);
  }

  @Post('/signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
