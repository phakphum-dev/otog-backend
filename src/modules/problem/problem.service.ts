import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROBLEM_REPOSITORY } from 'src/core/constants';
import { Problem } from '../../entities/problem.entity';
import { existsSync } from 'fs';
import { Submission } from 'src/entities/submission.entity';
import { Op, literal } from 'sequelize';
@Injectable()
export class ProblemService {
  constructor(
    @Inject(PROBLEM_REPOSITORY) private problemRepository: typeof Problem,
  ) {}

  findAll(): Promise<Problem[]> {
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

  async finOneById(id: number): Promise<Problem> {
    return await this.problemRepository.findOne({ where: { id } });
  }

  async getDocDirById(id: number): Promise<string> {
    const problem = await this.finOneById(id);
    const dir = `${process.cwd()}/docs/${problem.sname}.pdf`;
    if (!existsSync(dir)) throw new NotFoundException();
    return `${process.cwd()}/docs/${problem.sname}.pdf`;
  }

  async changeProblemShowById(problemId: number, show: boolean) {
    const problem = await this.problemRepository.findOne({
      where: {
        id: problemId,
      },
    });
    if (problem.show == show) throw new BadRequestException();
    problem.show = show;
    return problem.save();
  }
}
