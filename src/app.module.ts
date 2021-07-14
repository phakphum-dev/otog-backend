import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { ProblemModule } from './modules/problem/problem.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { ContestModule } from './modules/contest/contest.module';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from './core/database/database.module';
import { RolesGuard } from './core/guards/roles.guard';
import { ChatModule } from './modules/chat/chat.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env.local'],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProblemModule,
    SubmissionModule,
    ContestModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
