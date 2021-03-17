import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { problemProvider } from './problem.provider';

@Module({
  controllers: [ProblemController],
  providers: [ProblemService, ...problemProvider],
  exports: [ProblemService],
})
export class ProblemModule {}
