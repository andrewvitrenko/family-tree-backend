import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';
import { ENV } from '@/types/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const COOKIE_KEY = configService.get<string>(ENV.COOKIE_SECRET);
  app.use(cookieParser(COOKIE_KEY));

  const PORT = configService.get<number>(ENV.PORT);
  await app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

bootstrap();
