import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import * as cookeiParser from 'cookie-parser';
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookeiParser());
  const port = 3000;
  app.enableCors({ credentials: true, origin: 'http://localhost:4200' });
  await app.listen(port);
}
bootstrap();
