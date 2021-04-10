import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col } from 'sequelize';
import { fn } from 'sequelize';
import { Op, literal } from 'sequelize';
import {
  ContestMode,
  CONTEST_REPOSITORY,
  GradingMode,
} from 'src/core/constants';
import { ContestProblem } from 'src/entities/contestProblem.entity';
import { Submission } from 'src/entities/submission.entity';
import { User } from 'src/entities/user.entity';
import { UserContest } from 'src/entities/userContest.entity';
import { Contest } from '../../entities/contest.entity';
import { CreateContestDTO } from './dto/contest.dto';

@Injectable()
export class ContestService {
  constructor(
    @Inject(CONTEST_REPOSITORY) private contestRepository: typeof Contest,
  ) {}

  async create(createContest: CreateContestDTO): Promise<object> {
    try {
      const contest = new Contest();
      contest.name = createContest.name;
      contest.mode = createContest.mode;
      contest.gradingMode = createContest.gradingMode;
      contest.timeStart = createContest.timeStart;
      contest.timeEnd = createContest.timeEnd;
      await contest.save();
    } catch {
      throw new BadRequestException();
    }
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

  async scoreboardByContestId(contestId: number) {
    return await this.contestRepository.scope('full').findOne({
      include: [
        {
          model: User.scope('noPass'),
          through: {
            attributes: [],
          },
          include: [
            {
              model: Submission,
              attributes: ['id', 'problemId', 'score', 'timeUsed', 'status'],
              where: {
                contestId,
                id: {
                  [Op.in]: [
                    literal(
                      'SELECT MAX(id) FROM submission GROUP BY problemId,userId',
                    ),
                  ],
                },
              },
            },
          ],
        },
      ],
      where: { id: contestId },
    });
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

  async addUserToContest(contestId: number, userId: number) {
    try {
      const userContest = new UserContest();
      userContest.userId = userId;
      userContest.contestId = contestId;
      await userContest.save();
    } catch {
      throw new BadRequestException();
    }
    return { msg: `add user id: ${userId} to contest id: ${contestId}` };
  }
}
