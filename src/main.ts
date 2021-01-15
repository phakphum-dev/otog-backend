import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.setGlobalPrefix('/api');
  const config = new DocumentBuilder()
    .setTitle('OTOG API')
    .setDescription('API service for OTOG')
    .setVersion('1.0')
    .addTag('otog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
