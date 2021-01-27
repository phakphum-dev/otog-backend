import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContestController } from './contest.controller';
import { Contest } from '../models/contest.model';
import { ContestService } from './contest.service';

@Module({
  imports: [SequelizeModule.forFeature([Contest])],
  controllers: [ContestController],
  providers: [ContestService],
})
export class ContestModule {}
