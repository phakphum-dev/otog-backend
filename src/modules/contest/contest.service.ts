import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  ContestMode,
  CONTEST_REPOSITORY,
  GradingMode,
} from 'src/core/constants';
import { ContestProblem } from 'src/entities/contestProblem.entity';
import { Contest } from '../../entities/contest.entity';
import { CreateContestDTO } from './dto/contest.dto';

@Injectable()
export class ContestService {
  constructor(
    @Inject(CONTEST_REPOSITORY) private contestRepository: typeof Contest,
  ) {}

  async create(createContest: CreateContestDTO): Promise<object> {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 1000 * 60 * 30);
    const contest = new Contest();
    contest.name = 'Contest01';
    contest.mode = ContestMode.Rated;
    contest.gradingMode = GradingMode.Classic;
    contest.timeStart = new Date();
    contest.timeEnd = expiryDate;
    await contest.save();
    return { msg: 'create contest complete.' };
  }

  findAll(): Promise<Contest[]> {
    return this.contestRepository.findAll();
  }

  findOneById(contestId: number): Promise<Contest> {
    return this.contestRepository
      .scope('full')
      .findOne({ where: { id: contestId } });
  }

  currentContest(): Promise<Contest> {
    return this.contestRepository.scope('full').findOne({
      where: {
        timeEnd: {
          [Op.gte]: Date.now() - 3600,
        },
      },
    });
  }

  async addProblemToContest(contestId: number, problemId: number) {
    try {
      const contestProblem = new ContestProblem();
      contestProblem.problemId = problemId;
      contestProblem.contestId = contestId;
      await contestProblem.save();
    } catch {
      throw new BadRequestException();
    }
    return { msg: `add problem id: ${problemId} to contest id: ${contestId}` };
  }
}
