import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { problemProvider } from './problem.provider';
import { ContestModule } from '../contest/contest.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ContestModule, AuthModule, UserModule],
  controllers: [ProblemController],
  providers: [ProblemService, ...problemProvider],
  exports: [ProblemService],
})
export class ProblemModule {}
