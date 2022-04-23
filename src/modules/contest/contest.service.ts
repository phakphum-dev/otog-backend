import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Op, literal } from 'sequelize';
import {
  CONTESTPROBLEM_REPOSITORY,
  CONTEST_REPOSITORY,
  Role,
  SUBMISSION_REPOSITORY,
  USERCONTEST_REPOSITORY,
} from 'src/core/constants';
import { ContestProblem } from 'src/entities/contestProblem.entity';
import { Problem } from 'src/entities/problem.entity';
import { Submission } from 'src/entities/submission.entity';
import { User } from 'src/entities/user.entity';
import { UserContest } from 'src/entities/userContest.entity';
import { Contest } from '../../entities/contest.entity';
import { CreateContestDTO, UpdateContestDTO } from './dto/contest.dto';

@Injectable()
export class ContestService {
  constructor(
    @Inject(CONTEST_REPOSITORY) private contestRepository: typeof Contest,
    @Inject(CONTESTPROBLEM_REPOSITORY)
    private contestProblemRepository: typeof ContestProblem,
    @Inject(USERCONTEST_REPOSITORY)
    private userContestRepository: typeof UserContest,
    @Inject(SUBMISSION_REPOSITORY)
    private submissionRepository: typeof Submission,
  ) {}

  async create(createContest: CreateContestDTO) {
    try {
      const contest = new Contest();
      contest.name = createContest.name;
      contest.mode = createContest.mode;
      contest.gradingMode = createContest.gradingMode;
      contest.timeStart = createContest.timeStart;
      contest.timeEnd = createContest.timeEnd;
      return await contest.save();
    } catch {
      throw new BadRequestException();
    }
  }

  findAll(): Promise<Contest[]> {
    return this.contestRepository.findAll({
      order: [['id', 'DESC']],
    });
  }

  findOneById(contestId: number): Promise<Contest> {
    return this.contestRepository
      .scope('full')
      .findOne({ where: { id: contestId } });
  }

  async scoreboardByContestId(contestId: number) {
    return this.contestRepository.scope('full').findOne({
      include: [
        {
          model: User.scope('noPass'),
          through: {
            attributes: [],
          },
          where: { role: Role.User },
          include: [
            {
              model: Submission,
              attributes: ['id', 'problemId', 'score', 'timeUsed', 'status'],
              where: {
                id: {
                  [Op.in]: [
                    literal(
                      `SELECT MAX(id) FROM submission WHERE "contestId" = ${contestId} GROUP BY "submission"."problemId","submission"."userId"`,
                    ),
                  ],
                },
              },
            },
          ],
        },
      ],
      where: { id: contestId },
      rejectOnEmpty: true,
    });
  }

  async scoreboardPrizeByContestId(contestId: number) {
    await this.contestRepository.findOne({
      where: { id: contestId },
      rejectOnEmpty: true,
    });
    // * 1. First Blood: The first user that passed the task.
    const firstBlood = await this.submissionRepository.findAll({
      attributes: ['id'],
      where: {
        id: {
          [Op.in]: [
            literal(
              `SELECT MIN(submission.id) AS id
              FROM submission
              INNER JOIN "user"
              ON "user".id = submission."userId" AND "user"."role"='user'
              WHERE "contestId" = ${contestId} AND status = 'accept'
              GROUP BY "submission"."problemId"`,
            ),
          ],
        },
      },
      include: [
        { model: Problem, attributes: ['id'] },
        { model: User, attributes: ['id', 'showName'] },
      ],
    });

    // * 2. Faster Than Light: The user that solved the task with fastest algorithm.
    const fasterThanLight = await this.submissionRepository.findAll({
      attributes: ['id', 'timeUsed'],
      where: {
        contestId,
        id: {
          [Op.in]: [
            literal(
              `SELECT s.id AS id
              FROM (
                SELECT "problemId", MIN("timeUsed") AS "minTimeUsed"
                FROM submission
                INNER JOIN "user"
                ON "user".id = submission."userId" AND "user"."role"='user'
                WHERE "contestId" = ${contestId} AND status = 'accept' GROUP BY "submission"."problemId"
              ) t
              INNER JOIN (
                SELECT submission.*
                FROM submission
                INNER JOIN "user"
                ON "user".id = submission."userId" AND "user"."role"='user'
                WHERE "contestId" = ${contestId} AND status = 'accept'
              ) s
              ON s."problemId" = t."problemId" AND s."timeUsed" = t."minTimeUsed"`,
            ),
          ],
        },
      },
      include: [
        { model: Problem, attributes: ['id'] },
        { model: User, attributes: ['id', 'showName'] },
      ],
    });

    // * 3. Passed In One: The user that passed the task in one submission.
    const passedInOne = await this.submissionRepository.findAll({
      attributes: ['id'],
      where: {
        contestId,
        id: {
          [Op.in]: [
            literal(
              `SELECT s.id AS id
              FROM (
                SELECT "problemId", COUNT(*) AS "submitCount", "userId"
                FROM submission
                INNER JOIN "user"
                ON "user".id = submission."userId" AND "user"."role"='user'
                WHERE "contestId" = ${contestId}
                GROUP BY "problemId", "userId"
              ) t
              INNER JOIN submission s
              ON t."submitCount" = 1 AND s."problemId" = t."problemId" AND
              s."userId" = t."userId" AND s."status" = 'accept' AND s."contestId" = ${contestId}`,
            ),
          ],
        },
      },
      include: [
        { model: Problem, attributes: ['id'] },
        { model: User, attributes: ['id', 'showName'] },
      ],
    });

    // * 4. One Man Solve: The only one user that passed the task.
    const oneManSolve = await this.submissionRepository.findAll({
      attributes: ['id'],
      where: {
        contestId,
        id: {
          [Op.in]: [
            literal(
              `SELECT DISTINCT ON (s."problemId")
                s.id AS id
              FROM (
                SELECT "problemId", COUNT(DISTINCT "userId") AS "passedCount"
                FROM submission
                INNER JOIN "user"
                ON "user".id = submission."userId" AND "user"."role"='user'
                WHERE "contestId" = ${contestId} AND submission.status = 'accept'
                GROUP BY "problemId"
              ) t
              INNER JOIN (
                SELECT submission.*
                FROM submission
                INNER JOIN "user"
                ON "user".id = submission."userId" AND "user"."role"='user'
                WHERE "contestId" = ${contestId} AND status = 'accept'
              ) s
              ON t."passedCount" = 1 AND s."problemId" = t."problemId"`,
            ),
          ],
        },
      },
      include: [
        { model: Problem, attributes: ['id'] },
        { model: User, attributes: ['id', 'showName'] },
      ],
    });
    return { firstBlood, fasterThanLight, passedInOne, oneManSolve };
  }

  currentContest(): Promise<Contest> {
    return this.contestRepository.scope('full').findOne({
      where: {
        timeEnd: {
          [Op.gte]: Date.now() - 60 * 60 * 1000,
        },
      },
      order: [['id', 'DESC']],
    });
  }

  getStartedAndUnFinishedContest(): Promise<Contest> {
    return this.contestRepository.scope('full').findOne({
      where: {
        timeStart: {
          [Op.lte]: Date.now(),
        },
        timeEnd: {
          [Op.gte]: Date.now(),
        },
      },
      order: [['id', 'DESC']],
    });
  }

  async addProblemToContest(
    contestId: number,
    problemId: number,
    show: boolean,
  ) {
    try {
      if (show) {
        const contestProblem = new ContestProblem();
        contestProblem.problemId = problemId;
        contestProblem.contestId = contestId;
        await contestProblem.save();
        return { problemId, contestId, show };
      } else {
        const contestProblem = await this.contestProblemRepository.findOne({
          where: {
            contestId,
            problemId,
          },
        });
        await contestProblem.destroy();
        return { problemId, contestId, show };
      }
    } catch {
      throw new BadRequestException();
    }
  }

  async addUserToContest(contestId: number, userId: number) {
    return await this.userContestRepository.findOrCreate({
      where: { userId, contestId },
      defaults: {
        userId,
        contestId,
      },
    });
  }

  async updateContest(contestId: number, contestData: UpdateContestDTO) {
    const contest = await this.findOneById(contestId);
    return contest.update(contestData);
  }

  async deleteContest(contestId: number) {
    const contest = await this.findOneById(contestId);
    await contest.destroy();
    return contest;
  }
}
