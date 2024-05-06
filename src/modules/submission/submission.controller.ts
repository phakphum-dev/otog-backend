import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  LatestSubmissionDTO,
  LatestSubmissionWithSourceCodeDTO,
  PublicSubmissionDTO,
  SubmissionDTO,
  SubmissionWithSourceCodeDTO,
  UploadFileDTO,
} from './dto/submission.dto';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { AccessState, Role } from 'src/core/constants';
import { User } from 'src/core/decorators/user.decorator';
import { UserDTO } from '../user/dto/user.dto';
import { ContestService } from '../contest/contest.service';
import { OptionalIntPipe } from 'src/utils/optional.pipe';
import { OfflineAccess } from 'src/core/decorators/offline-mode.decorator';
import { Status } from 'src/core/constants';

@ApiTags('submission')
@Controller('submission')
@UseGuards(RolesGuard)
export class SubmissionController {
  constructor(
    private submissionService: SubmissionService,
    private contestService: ContestService,
  ) {}

  @Get()
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    type: SubmissionDTO,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (numeric string is expected)',
  })
  getAllSubmission(
    @User() user: UserDTO,
    @Query('offset', OptionalIntPipe) offset?: number,
    @Query('limit', OptionalIntPipe) limit?: number,
  ) {
    return user.role === Role.Admin
      ? this.submissionService.findAll(offset, limit)
      : this.submissionService.findAllWithOutContestAndAdmin(offset, limit);
  }

  // unused
  @Roles(Role.Admin)
  @Get('/contest')
  @ApiBearerAuth()
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    type: SubmissionDTO,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (numeric string is expected)',
  })
  getContestSubmission(
    @Query('offset', OptionalIntPipe) offset: number,
    @Query('limit', OptionalIntPipe) limit: number,
  ) {
    return this.submissionService.findAllWithContest(offset, limit);
  }

  @OfflineAccess(AccessState.Authenticated)
  @Roles(Role.Admin, Role.User)
  @Get('/problem/:problemId/latest')
  @ApiBearerAuth()
  @ApiOkResponse({ type: LatestSubmissionWithSourceCodeDTO })
  @ApiNotFoundResponse({ description: 'Submission for the problem not found' })
  @ApiNotFoundResponse({ description: 'Problem not found' })
  async getLatestSubmissionByProblemId(
    @Param('problemId', ParseIntPipe) problemId: number,
    @User() user: UserDTO,
  ) {
    return {
      latestSubmission:
        await this.submissionService.findOneByProblemIdAndUserId(
          problemId,
          user.id,
        ),
    };
  }

  @OfflineAccess(AccessState.Authenticated)
  @Roles(Role.User, Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDTO })
  @Post('/problem/:problemId')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Submit successfully' })
  @ApiNotFoundResponse({ description: 'Problem not found' })
  @UseInterceptors(FileInterceptor('sourceCode'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('problemId', ParseIntPipe) problemId: number,
    @User() user: UserDTO,
    @Body() data: UploadFileDTO,
  ) {
    if (data.contestId) {
      // TODO validate user if contest is private
      await this.contestService.addUserToContest(data.contestId, user.id);
    }
    return this.submissionService.create(user, problemId, data, file);
  }

  @Roles(Role.User, Role.Admin)
  @Get('/latest')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: LatestSubmissionDTO,
    description: 'Get the latest submission',
  })
  async getLatestSubmissionWithUserId(@User() user: UserDTO) {
    return {
      latestSubmission: await this.submissionService.findOneByUserId(user.id),
    };
  }

  @Roles(Role.User, Role.Admin)
  @Get('/user/:userId')
  @ApiBearerAuth()
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    type: SubmissionDTO,
    isArray: true,
    description: 'Get some submissions from query',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed (numeric string is expected)',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiForbiddenResponse({
    description: 'User id must be the same as userId',
  })
  getAllSubmissionByUserId(
    @User() user: UserDTO,
    @Param('userId', ParseIntPipe) userId: number,
    @Query('offset', OptionalIntPipe) offset?: number,
    @Query('limit', OptionalIntPipe) limit?: number,
  ) {
    if (user.role === 'admin') {
      return this.submissionService.findAllByUserId(userId, offset, limit);
    }
    if (user.id === userId) {
      return this.submissionService.findAllByUserIdWithOutContest(
        userId,
        offset,
        limit,
      );
    }
    throw new ForbiddenException();
  }

  @OfflineAccess(AccessState.Authenticated)
  @Get('/:resultId')
  @ApiOkResponse({
    type: SubmissionDTO,
    description: 'Get submission by id',
  })
  @ApiNotFoundResponse({ description: 'Submission not found' })
  async getSubmissionById(@Param('resultId', ParseIntPipe) resultId: number) {
    const submission = await this.submissionService.findOneByResultId(resultId);
    if (!submission) {
      throw new NotFoundException();
    }
    return submission;
  }

  @OfflineAccess(AccessState.Authenticated)
  @Get('/:resultId/code')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: SubmissionWithSourceCodeDTO,
    description: 'Get submission with source code by id',
  })
  @ApiNotFoundResponse({ description: 'Submission not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getSubmissionWithCodeById(
    @Param('resultId', ParseIntPipe) resultId: number,
    @User() user: UserDTO,
  ) {
    const submission = await this.submissionService.findOneByResultIdWithCode(
      resultId,
    );
    if (!submission) {
      throw new NotFoundException();
    }
    if (
      !(
        submission.public ||
        submission.user.id === user.id ||
        user.role === Role.Admin
      )
    ) {
      throw new ForbiddenException();
    }
    return submission;
  }

  @Roles(Role.User, Role.Admin)
  @Patch('/:resultId/share')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: SubmissionWithSourceCodeDTO,
  })
  @ApiBody({
    type: PublicSubmissionDTO,
  })
  @ApiNotFoundResponse({ description: 'Submission not found' })
  @ApiBadRequestResponse({
    description: 'Validation failed (numeric string is expected)',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async shareSubmission(
    @User() user: UserDTO,
    @Param('resultId', ParseIntPipe) resultId: number,
    @Body('show', ParseBoolPipe) show: boolean,
  ) {
    const submission = await this.submissionService.findOneByResultIdWithCode(
      resultId,
    );
    if (!submission) {
      throw new NotFoundException();
    }
    if (!(user.id === submission.user.id || user.role === Role.Admin)) {
      throw new ForbiddenException();
    }
    submission.public = show;
    return await submission.save();
  }

  @Roles(Role.Admin)
  @Post('/:resultId/rejudge')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: SubmissionWithSourceCodeDTO,
    description: 'Rejudge a submission by setting status to waiting',
  })
  @ApiNotFoundResponse({ description: 'Submission not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async rejudgeSubmission(@Param('resultId', ParseIntPipe) resultId: number) {
    const submission = await this.submissionService.findOneByResultId(resultId);
    if (!submission) {
      throw new NotFoundException();
    }
    submission.status = Status.Waiting;
    submission.result = 'Rejudging';
    return await submission.save();
  }

  @Roles(Role.Admin)
  @Post('problem/:problemId/rejudge')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Rejudge all latest submission of a problem',
  })
  @ApiNotFoundResponse({ description: 'ProblemId not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async rejudgeProblem(@Param('problemId', ParseIntPipe) problemId: number) {
    const submissions = await this.submissionService.findAllLatestSubmission(
      problemId,
    );
    await Promise.all(
      submissions.map((submission) =>
        submission.update({
          status: Status.Waiting,
          result: 'Rejudging',
        }),
      ),
    );
  }
}
