import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'src/core/decorators/user.decorator';
import { UserDTO } from '../user/dto/user.dto';
import { ProblemDTO } from './dto/problem.dto';
import { ProblemService } from './problem.service';

@ApiTags('problem')
@Controller('problem')
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ProblemDTO,
    isArray: true,
  })
  getAllProblems(@User() user: UserDTO) {
    if (user) {
      return this.problemService.findAllWithSubmissionByUserId(user.id);
    } else {
      return this.problemService.findAll();
    }
  }

  @Get('/:probId')
  @ApiResponse({
    status: 200,
    type: ProblemDTO,
  })
  getProblemById(@Param('probId') probId: number) {
    return this.problemService.finOneById(probId);
  }

  @Get('doc/:probId')
  async getDocById(@Param('probId') probId: number, @Res() res: Response) {
    return res.sendFile(await this.problemService.getDocDirById(probId));
  }
}
