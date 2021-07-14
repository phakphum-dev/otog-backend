import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROBLEM_REPOSITORY, Role } from 'src/core/constants';
import { Problem } from '../../entities/problem.entity';
import { existsSync, mkdirSync, renameSync, rmdirSync, unlinkSync } from 'fs';
import { Submission } from 'src/entities/submission.entity';
import { Op, literal } from 'sequelize';
import {
  CreateProblemDTO,
  EditProblemDTO,
  UploadedFilesObject,
} from './dto/problem.dto';
import { createReadStream } from 'fs';
import { Extract } from 'unzipper';
import { UserDTO } from '../user/dto/user.dto';
import { SubmissionService } from '../submission/submission.service';
import { lowerBound, upperBound } from 'src/utils';
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

      //save pdf file
      if (files.pdf) {
        const newDir = `./docs`;
        // check source dir is exist
        if (!existsSync(newDir)) {
          mkdirSync(newDir);
        }
        const newPath = `${newDir}/${problem.id}.pdf`;
        // move pdf file to source folder
        renameSync(files.pdf[0].path, newPath);
      }

      if (files.zip) {
        const newDir = `./source/${problem.id}`;
        // check source dir is exist
        if (!existsSync(newDir)) {
          mkdirSync(newDir, { recursive: true });
        }
        const newPath = `${newDir}/tmp.zip`;
        // move zip file to source folder
        renameSync(files.zip[0].path, newPath);
        // unzip source file
        const fileContents = createReadStream(newPath);
        fileContents.pipe(Extract({ path: newDir }));
        unlinkSync(newPath);
      }
      return problem;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async ReplaceByProblemId(
    problemId: number,
    newProblem: EditProblemDTO,
    files: UploadedFilesObject,
  ): Promise<Problem> {
    try {
      const problem = await this.findOneById(newProblem.id);
      problem.name = newProblem.name;
      problem.score = newProblem.score;
      problem.timeLimit = newProblem.timeLimit;
      problem.memoryLimit = newProblem.memoryLimit;
      problem.case = newProblem.case;
      await problem.save();

      //save pdf file
      if (files.pdf) {
        const newDir = `./docs`;
        // check source dir is exist
        if (!existsSync(newDir)) {
          mkdirSync(newDir);
        }
        const newPath = `${newDir}/${problem.id}.pdf`;
        //remove old file
        unlinkSync(newPath);
        // move pdf file to source folder
        renameSync(files.pdf[0].path, newPath);
      }

      if (files.zip) {
        const newDir = `./source/${problem.id}`;
        //remove old dir
        rmdirSync(newDir, { recursive: true });
        // check source dir is exist
        if (!existsSync(newDir)) {
          mkdirSync(newDir, { recursive: true });
        }
        const newPath = `${newDir}/tmp.zip`;
        // move zip file to source folder
        renameSync(files.zip[0].path, newPath);
        // unzip source file
        const fileContents = createReadStream(newPath);
        fileContents.pipe(Extract({ path: newDir }));
        unlinkSync(newPath);
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
                  'SELECT MAX(id) FROM submission GROUP BY problemId,userId',
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
                  'SELECT MAX(id) FROM submission GROUP BY problemId,userId',
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
    const dir = `${process.cwd()}/docs/${problem?.id}.pdf`;
    if (!existsSync(dir)) throw new NotFoundException();
    return `${process.cwd()}/docs/${problem.id}.pdf`;
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
    var result: any[] = new Array();
    for (var i in problem) {
      let passedCount = 0;
      let lIdx = lowerBound(latestAccept, problem[i].id, (x) => x.problemId);
      let rIdx = upperBound(latestAccept, problem[i].id, (x) => x.problemId);
      if (lIdx != -1) passedCount = rIdx - lIdx;
      result.push({ ...problem[i], passedCount });
    }
    return result;
  }

  async findAllUserAcceptByProblemId(problemId: number) {
    const latestAccept = await this.submissionService.findAllLatestAccept();
    let lIdx = lowerBound(latestAccept, problemId, (x) => x.problemId);
    let rIdx = upperBound(latestAccept, problemId, (x) => x.problemId);
    const temp = latestAccept.slice(lIdx, rIdx);
    return temp.map((submission) => submission.user);
  }

  async delete(problemId: number) {
    try {
      const problem = await this.findOneById(problemId);

      const pdfPath = `./docs/${problem.id}.pdf`;
      if (existsSync(pdfPath)) unlinkSync(pdfPath);

      const testCasePath = `./source/${problem.id}`;
      if (existsSync(testCasePath))
        rmdirSync(testCasePath, { recursive: true });

      return await problem.destroy();
    } catch (e) {
      console.log(e);

      throw new BadRequestException();
    }
  }
}
