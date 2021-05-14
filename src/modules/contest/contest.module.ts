import { Module } from '@nestjs/common';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { contestProvider } from './contest.provider';

@Module({
  controllers: [ContestController],
  providers: [ContestService, ...contestProvider],
  exports: [ContestService],
})
export class ContestModule {}
