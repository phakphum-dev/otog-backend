import { Module } from '@nestjs/common';
import { ContestModule } from '../contest/contest.module';
import { SubmissionController } from './submission.controller';
import { submissionProvider } from './submission.provider';
import { SubmissionService } from './submission.service';

@Module({
  imports: [ContestModule],
  controllers: [SubmissionController],
  providers: [SubmissionService, ...submissionProvider],
  exports: [SubmissionService],
})
export class SubmissionModule {}
