import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROBLEM_REPOSITORY } from 'src/core/constants';
import { Problem } from '../../entities/problem.entity';
import { existsSync } from 'fs';
@Injectable()
export class ProblemService {
  constructor(
    @Inject(PROBLEM_REPOSITORY) private problemRepository: typeof Problem,
  ) {}

  findAll(): Promise<Problem[]> {
    return this.problemRepository.findAll();
  }

  finOne(arg: any): Promise<Problem> {
    return this.problemRepository.findOne({ where: arg });
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
}
