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
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Role } from 'src/core/constants';
import { Roles } from 'src/core/decorators/roles.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { AuthService } from '../auth/auth.service';
import { ContestService } from '../contest/contest.service';
import { UserDTO } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import {
  CreateProblemDTO,
  EditProblemDTO,
  ProblemDTO,
  ToggleProblemDTO,
  UploadedFilesObject,
} from './dto/problem.dto';
import { ProblemService } from './problem.service';

@ApiTags('problem')
@Controller('problem')
export class ProblemController {
  constructor(
    private problemService: ProblemService,
    private contestService: ContestService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: ProblemDTO,
    isArray: true,
    description: 'Get problems depends on user permission',
  })
  async getAllProblems(@User() user: UserDTO) {
    return user
      ? user.role == Role.Admin
        ? await this.problemService.findAllWithSubmissionByUserId_ADMIN(user.id)
        : await this.problemService.findAllWithSubmissionByUserId(user.id)
      : await this.problemService.findAllNotShow();
  }

  @Get('/:problemId')
  @ApiOkResponse({
    type: ProblemDTO,
    description: 'Get problem by id',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Problem not found' })
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

  @Get('/:problemId/user')
  @ApiOkResponse({
    type: UserDTO,
    isArray: true,
    description: 'Get passed users',
  })
  @ApiNotFoundResponse({ description: 'Problem not found' })
  async getUserAccept(@Param('problemId', ParseIntPipe) problemId: number) {
    return this.problemService.findAllUserAcceptByProblemId(problemId);
  }

  @Get('doc/:problemId')
  @ApiOkResponse({ description: 'Get problem document (pdf)' })
  @ApiNotFoundResponse({ description: 'Problem not found' })
  async getDocById(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let user = null;
    const rid = await req.cookies['RID'];
    if (rid) {
      const refreshToken = await this.authService.findOneByRID(rid);
      user = await this.userService.findOneById(refreshToken?.userId);
    }

    const problem = await this.problemService.findOneById(problemId);
    if (problem?.show == false && user?.role != Role.Admin) {
      const contest = await this.contestService.getStartedAndUnFinishedContest();
      if (!contest || !contest.problems.some((e) => e.id === problem.id))
        throw new ForbiddenException();
    }
    return res.sendFile(await this.problemService.getProblemDocDir(problem));
  }

  //Admin route
  @Roles(Role.Admin)
  @Patch('/:problemId')
  @ApiBody({ type: ToggleProblemDTO })
  @ApiOkResponse({ type: ProblemDTO, description: 'Toggle problem show state' })
  @ApiNotFoundResponse({ description: 'Problem not found' })
  changeProblemShowById(
    @Param('problemId', ParseIntPipe) problemId: number,
    @Body('show', ParseBoolPipe) show: boolean,
  ) {
    return this.problemService.changeProblemShowById(problemId, show);
  }

  @Roles(Role.Admin)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProblemDTO })
  @ApiCreatedResponse({
    type: ProblemDTO,
    description: 'Create new problem',
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

  @Roles(Role.Admin)
  @Put('/:problemId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: EditProblemDTO })
  @ApiOkResponse({
    type: ProblemDTO,
    description: 'New problem detail',
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
  replaceProblem(
    @Body() newProblem: EditProblemDTO,
    @UploadedFiles() files: UploadedFilesObject,
  ) {
    return this.problemService.ReplaceByProblemId(newProblem, files);
  }
}
