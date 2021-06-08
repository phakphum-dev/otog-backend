import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { SocketIoAdapter } from './core/adapters/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('/api');
  const config = new DocumentBuilder()
    .setTitle('OTOG API')
    .setDescription('API service for OTOG')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useWebSocketAdapter(new SocketIoAdapter(app, true));
  await app.listen(8000);
}
bootstrap();
