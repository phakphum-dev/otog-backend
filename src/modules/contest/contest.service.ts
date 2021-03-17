import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CONTEST_REPOSITORY } from 'src/core/constants';
import { Contest } from '../../entities/contest.entity';

@Injectable()
export class ContestService {
  constructor(
    @Inject(CONTEST_REPOSITORY) private contestRepository: typeof Contest,
  ) {}

  findAll(): Promise<Contest[]> {
    return this.contestRepository.findAll();
  }

  findOneById(contestId: number): Promise<Contest> {
    return this.contestRepository.findOne({ where: { id: contestId } });
  }

  currentContest(): Promise<Contest> {
    return this.contestRepository.findOne({
      where: {
        timeEnd: {
          [Op.gte]: Date.now() - 3600,
        },
      },
    });
  }
}
