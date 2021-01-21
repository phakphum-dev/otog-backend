import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { ProblemService } from './problem.service';

@Controller('problem')
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  @Get()
  getAllProblems() {
    return this.problemService.findAll();
  }

  @Get('/:probId')
  getProblemById(@Param('probId') probId: number) {
    return this.problemService.finOne({ probId });
  }

  @Get('doc/:probId')
  async getDocById(@Param('probId') probId: number, @Res() res: Response) {
    const prob = await this.problemService.finOne({ probId });
    res.sendFile(`${process.cwd()}/docs/${prob.sname}.pdf`);
  }
}
