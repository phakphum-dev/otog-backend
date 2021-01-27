import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubmissionController } from './submission.controller';
import { Submission } from '../models/submission.model';
import { SubmissionService } from './submission.service';

@Module({
  imports: [SequelizeModule.forFeature([Submission])],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
