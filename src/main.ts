import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { configuration } from './core/config/configuration';
import { OfflineModeGuard } from './core/guards/offline-mode.guard';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('OTOG API')
    .setDescription('API service for OTOG')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });
  const reflector = app.get(Reflector);
  const offlineMode = configuration().offlineMode;
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    offlineMode ? new OfflineModeGuard(reflector) : undefined,
  );
  await app.listen(PORT);
}
bootstrap();
