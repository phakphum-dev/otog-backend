import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProblemController } from './problem.controller';
import { Problem } from '../models/problem.model';
import { ProblemService } from './problem.service';

@Module({
  imports: [SequelizeModule.forFeature([Problem])],
  controllers: [ProblemController],
  providers: [ProblemService],
})
export class ProblemModule {}
