import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*', credentials: false },
  });

  await app.listen(process.env.API_PORT || 8080);

  console.log(`Api running in port: ${process.env.API_PORT || 8080}`);
}

bootstrap();
