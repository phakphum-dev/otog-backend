import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Role } from 'src/core/constants';
import { Roles } from 'src/core/decorators/roles.decorator';
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

  @Get('/:problemId')
  @ApiResponse({
    status: 200,
    type: ProblemDTO,
  })
  getProblemById(@Param('problemId', ParseIntPipe) problemId: number) {
    return this.problemService.finOneById(problemId);
  }

  @Get('doc/:problemId')
  async getDocById(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Res() res: Response,
  ) {
    return res.sendFile(await this.problemService.getDocDirById(problemId));
  }

  //Admin route
  @Roles(Role.Admin)
  @Patch('/:problemId')
  @ApiResponse({
    status: 200,
    type: ProblemDTO,
  })
  changeProblemShowById(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Body('show', ParseBoolPipe) show: boolean,
  ) {
    return this.problemService.changeProblemShowById(problemId, show);
  }
}
