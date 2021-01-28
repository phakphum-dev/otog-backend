import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { ProblemDto } from './dto/problem.dto';
import { ProblemService } from './problem.service';

@ApiTags('problem')
@Controller('problem')
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ProblemDto,
    isArray: true,
  })
  getAllProblems() {
    return this.problemService.findAll();
  }

  @Get('/:probId')
  @ApiResponse({
    status: 200,
    type: ProblemDto,
  })
  getProblemById(@Param('probId') probId: number) {
    return this.problemService.finOne({ id: probId });
  }

  @Get('doc/:probId')
  async getDocById(@Param('probId') probId: number, @Res() res: Response) {
    const prob = await this.problemService.finOne({ id: probId });
    res.sendFile(`${process.cwd()}/docs/${prob.sname}.pdf`);
  }
}
