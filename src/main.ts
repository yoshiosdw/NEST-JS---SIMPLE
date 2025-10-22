import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { errorResponse } from './common/utils/response.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        // ambil semua pesan dari DTO
        const messages = errors
          .map(err => Object.values(err.constraints || {}).join(', '))
          .join('; ');
        return new BadRequestException(errorResponse(messages, 400));
      },
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
