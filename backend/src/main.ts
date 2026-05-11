import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeSocket } from './socket';
import { Server as HttpServer } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply a global prefix to all REST routes (e.g., /api/users)
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = process.env.BACKEND_PORT || process.env.PORT || 3001;

  // Initialize Socket.IO with the underlying HTTP server before calling listen().
  initializeSocket(app.getHttpServer() as HttpServer);

  await app.listen(port);
}
void bootstrap();
