import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROBLEM_REPOSITORY } from 'src/core/constants';
import { Problem } from '../../entities/problem.entity';
import { Submission } from 'src/entities/submission.entity';
import { Op, literal } from 'sequelize';
import {
  CreateProblemDTO,
  EditProblemDTO,
  UploadedFilesObject,
} from './dto/problem.dto';
import { SubmissionService } from '../submission/submission.service';
import { lowerBound, upperBound } from 'src/utils';
import {
  getProblemDocDir,
  removeProblemSource,
  updateProblemDoc,
  updateProblemTestCase,
} from 'src/utils/file.util';
@Injectable()
export class ProblemService {
  constructor(
    @Inject(PROBLEM_REPOSITORY) private problemRepository: typeof Problem,
    private submissionService: SubmissionService,
  ) {}

  async create(
    createProblem: CreateProblemDTO,
    files: UploadedFilesObject,
  ): Promise<Problem> {
    try {
      const problem = new Problem();
      problem.name = createProblem.name;
      problem.score = createProblem.score;
      problem.timeLimit = createProblem.timeLimit;
      problem.memoryLimit = createProblem.memoryLimit;
      problem.case = createProblem.case;
      problem.show = false;
      await problem.save();

      if (files.pdf) {
        await updateProblemDoc(`${problem.id}`, files.pdf[0].path);
      }

      if (files.zip) {
        await updateProblemTestCase(`${problem.id}`, files.zip[0].path);
      }

      return problem;
    } catch (err) {
      console.log(err);

      throw new BadRequestException();
    }
  }

  async ReplaceByProblemId(
    problemId: number,
    newProblem: EditProblemDTO,
    files: UploadedFilesObject,
  ): Promise<Problem> {
    try {
      const problem = await this.findOneById(problemId);
      problem.name = newProblem.name;
      problem.score = newProblem.score;
      problem.timeLimit = newProblem.timeLimit;
      problem.memoryLimit = newProblem.memoryLimit;
      problem.case = newProblem.case;
      await problem.save();

      if (files.pdf) {
        await updateProblemDoc(`${problem.id}`, files.pdf[0].path);
      }

      if (files.zip) {
        await updateProblemTestCase(`${problem.id}`, files.zip[0].path);
      }

      return problem;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findAllNotShow() {
    const problem = await this.problemRepository.findAll({
      where: {
        show: true,
      },
      group: ['id'],
      raw: true,
      nest: true,
    });
    const latestAccept = await this.submissionService.findAllLatestAccept();
    return this.addPassedCountToProblem(problem, latestAccept);
  }

  async findAllWithSubmissionByUserId(userId: number) {
    const problem = await this.problemRepository.findAll({
      where: {
        show: true,
      },
      include: [
        {
          model: Submission,
          where: {
            id: {
              [Op.in]: [
                literal(
                  'SELECT MAX(id) FROM submission GROUP BY "submission"."problemId","submission"."userId"',
                ),
              ],
            },
            userId,
          },
          required: false,
        },
      ],
      raw: true,
      nest: true,
    });

    const latestAccept = await this.submissionService.findAllLatestAccept();
    return this.addPassedCountToProblem(problem, latestAccept);
  }

  async findAllWithSubmissionByUserId_ADMIN(userId: number) {
    const problem = await this.problemRepository.findAll({
      include: [
        {
          model: Submission,
          where: {
            id: {
              [Op.in]: [
                literal(
                  'SELECT MAX(id) FROM submission GROUP BY "submission"."problemId","submission"."userId"',
                ),
              ],
            },
            userId,
          },
          required: false,
        },
      ],
      raw: true,
      nest: true,
    });

    const latestAccept = await this.submissionService.findAllLatestAccept();
    return this.addPassedCountToProblem(problem, latestAccept);
  }

  async findOneById(id: number): Promise<Problem> {
    return await this.problemRepository.findOne({ where: { id } });
  }

  async getProblemDocDir(problem: Problem): Promise<string> {
    const docDir = getProblemDocDir(`${problem.id}`);
    if (!docDir) throw new NotFoundException();
    return docDir;
  }

  async changeProblemShowById(problemId: number, show: boolean) {
    const problem = await this.problemRepository.findOne({
      where: {
        id: problemId,
      },
    });
    if (problem.show == show) throw new BadRequestException();
    problem.show = show;
    problem.recentShowTime = new Date();
    return problem.save();
  }

  addPassedCountToProblem(problem: Problem[], latestAccept: Submission[]) {
    const result: any[] = [];
    for (const i in problem) {
      let passedCount = 0;
      const lIdx = lowerBound(latestAccept, problem[i].id, (x) => x.problemId);
      const rIdx = upperBound(latestAccept, problem[i].id, (x) => x.problemId);
      if (lIdx != -1) passedCount = rIdx - lIdx;
      result.push({ ...problem[i], passedCount });
    }
    return result;
  }

  async findAllUserAcceptByProblemId(problemId: number) {
    const latestAccept = await this.submissionService.findAllLatestAccept();
    const lIdx = lowerBound(latestAccept, problemId, (x) => x.problemId);
    const rIdx = upperBound(latestAccept, problemId, (x) => x.problemId);
    const temp = latestAccept.slice(lIdx, rIdx);
    return temp.map((submission) => submission.user);
  }

  async delete(problemId: number) {
    try {
      const problem = await this.findOneById(problemId);

      await removeProblemSource(`${problem.id}`);

      return await problem.destroy();
    } catch (e) {
      console.log(e);

      throw new BadRequestException();
    }
  }
}
