import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROBLEM_REPOSITORY, Role } from 'src/core/constants';
import { Problem } from '../../entities/problem.entity';
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import { Submission } from 'src/entities/submission.entity';
import { Op, literal } from 'sequelize';
import {
  CreateProblemDTO,
  ReplaceProblemDTO,
  UploadedFilesObject,
} from './dto/problem.dto';
import { createReadStream } from 'fs';
import { Extract } from 'unzipper';
import { UserDTO } from '../user/dto/user.dto';
@Injectable()
export class ProblemService {
  constructor(
    @Inject(PROBLEM_REPOSITORY) private problemRepository: typeof Problem,
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
    patchProblem: ReplaceProblemDTO,
    files: UploadedFilesObject,
  ): Promise<Problem> {
    try {
      const problem = await this.findOneById(patchProblem.id);
      problem.name = patchProblem.name;
      problem.score = patchProblem.score;
      problem.timeLimit = patchProblem.timeLimit;
      problem.memoryLimit = patchProblem.memoryLimit;
      problem.case = patchProblem.case;
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
        unlinkSync(newDir);
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

  findAllNotShow(): Promise<Problem[]> {
    return this.problemRepository.findAll({
      where: {
        show: true,
      },
    });
  }

  findAllWithSubmissionByUserId(userId: number): Promise<Problem[]> {
    return this.problemRepository.findAll({
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
    });
  }

  findAllWithSubmissionByUserId_ADMIN(userId: number): Promise<Problem[]> {
    return this.problemRepository.findAll({
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
    });
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
}
