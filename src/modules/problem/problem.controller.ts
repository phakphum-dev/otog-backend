import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Role } from 'src/core/constants';
import { Roles } from 'src/core/decorators/roles.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { ContestService } from '../contest/contest.service';
import { UserDTO } from '../user/dto/user.dto';
import {
  CreateProblemDTO,
  ProblemDTO,
  UploadedFilesObject,
} from './dto/problem.dto';
import { ProblemService } from './problem.service';

@ApiTags('problem')
@Controller('problem')
export class ProblemController {
  constructor(
    private problemService: ProblemService,
    private contestService: ContestService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ProblemDTO,
    isArray: true,
  })
  async getAllProblems(@User() user: UserDTO) {
    return user
      ? user.role == Role.Admin
        ? await this.problemService.findAllWithSubmissionByUserId_ADMIN(user.id)
        : await this.problemService.findAllWithSubmissionByUserId(user.id)
      : await this.problemService.findAllNotShow();
  }

  @Get('/:problemId')
  @ApiResponse({
    status: 200,
    type: ProblemDTO,
  })
  async getProblemById(
    @Param('problemId', ParseIntPipe) problemId: number,
    @User() user: UserDTO,
  ) {
    const problem = await this.problemService.findOneById(problemId);
    if (problem?.show == false && user.role != Role.Admin) {
      throw new ForbiddenException();
    }
    return problem;
  }

  @Get('doc/:problemId')
  async getDocById(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Res() res: Response,
    @User() user: UserDTO,
  ) {
    const problem = await this.problemService.findOneById(problemId);
    if (problem?.show == false && user.role != Role.Admin) {
      const contest = await this.contestService.getStartedAndUnFinishedContest();
      if (!contest || !contest.problems.some((e) => e.id === problem.id))
        throw new ForbiddenException();
    }
    return res.sendFile(await this.problemService.getProblemDocDir(problem));
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

  @Roles(Role.Admin)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProblemDTO,
  })
  @ApiResponse({
    status: 200,
    type: ProblemDTO,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdf', maxCount: 1 },
        { name: 'zip', maxCount: 1 },
      ],
      {
        dest: './tmp/upload',
      },
    ),
  )
  createProblem(
    @Body() createProblem: CreateProblemDTO,
    @UploadedFiles() files: UploadedFilesObject,
  ) {
    return this.problemService.create(createProblem, files);
  }
}
