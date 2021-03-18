import { Controller, Get, Header, Param, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ProblemDto } from './dto/problem.dto';
import { ProblemService } from './problem.service';

@ApiTags('problem')
@Controller('problem')
@UseGuards(JwtAuthGuard)
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
    return this.problemService.finOneById(probId);
  }

  @Get('doc/:probId')
  async getDocById(@Param('probId') probId: number, @Res() res: Response) {
    return res.sendFile(await this.problemService.getDocDirById(probId));
  }
}
