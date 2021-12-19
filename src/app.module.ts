import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProblemModule } from './modules/problem/problem.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { ContestModule } from './modules/contest/contest.module';
import { DatabaseModule } from './core/database/database.module';
import { ChatModule } from './modules/chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './core/constants';
@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '10m',
      },
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
