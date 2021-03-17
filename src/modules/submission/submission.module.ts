import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { submissionProvider } from './submission.provider';
import { SubmissionService } from './submission.service';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService, ...submissionProvider],
})
export class SubmissionModule {}
