import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ProblemModule } from './problem/problem.module';
import { SubmissionModule } from './submission/submission.module';
import { ContestModule } from './contest/contest.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'db',
      port: 8888,
      username: 'root',
      password: '0000',
      database: 'otog',
      autoLoadModels: true,
      synchronize: true,
      define: {
        timestamps: false,
      },
    }),
    MulterModule.register({
      dest: './upload',
    }),
    UserModule,
    AuthModule,
    ProblemModule,
    SubmissionModule,
    ContestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
