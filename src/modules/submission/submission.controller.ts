import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SubmissionDTO,
  SubmissionWithSourceCodeDTO,
  UploadFileDTO,
} from './dto/submission.dto';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/constants';
import { User } from 'src/core/decorators/user.decorator';
import { UserDTO } from '../user/dto/user.dto';

@ApiTags('submission')
@Controller('submission')
@UseGuards(RolesGuard)
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: SubmissionDTO,
    isArray: true,
  })
  getAllSubmission(
    @Query('offset') os: string,
    @Query('limit') lm: string,
    @User() user: UserDTO,
  ) {
    const offset: number = parseInt(os);
    const limit: number = parseInt(lm);
    if ((os && isNaN(offset)) || (lm && isNaN(limit)))
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    return user.role == Role.Admin
      ? this.submissionService.findAllWithOutContest(offset, limit)
      : this.submissionService.findAllWithOutContestAndAdmin(offset, limit);
  }

  @Get('/contest')
  @ApiResponse({
    status: 200,
    type: SubmissionDTO,
    isArray: true,
  })
  getContestSubmission(
    @Query('offset') os: string,
    @Query('limit') lm: string,
  ) {
    const offset: number = parseInt(os);
    const limit: number = parseInt(lm);
    if ((os && isNaN(offset)) || (lm && isNaN(limit)))
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );

    return this.submissionService.findAllWithContest(offset, limit);
  }

  @Roles(Role.Admin, Role.User)
  @Get('/problem/:problemId/latest')
  @ApiResponse({
    status: 200,
    type: SubmissionWithSourceCodeDTO,
  })
  getLatestSubmissionByProblemId(
    @Param('problemId', ParseIntPipe) problemId: number,
    @User() user: UserDTO,
  ) {
    return this.submissionService.findOneByProblemIdAndUserId(
      problemId,
      user.id,
    );
  }

  @Roles(Role.User, Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDTO,
  })
  @Post('/problem/:problemId')
  @UseInterceptors(FileInterceptor('sourceCode'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('problemId', ParseIntPipe) problemId: number,
    @User() user: UserDTO,
    @Body() data: UploadFileDTO,
  ) {
    return this.submissionService.create(user, problemId, data, file);
  }

  @Roles(Role.User, Role.Admin)
  @Get('/latest')
  @ApiResponse({
    status: 200,
    type: SubmissionDTO,
  })
  getLatestSubmissionWithUserId(@User() user: UserDTO) {
    return this.submissionService.findOneByUserId(user.id);
  }

  @Get('/user/:userId')
  @ApiResponse({
    status: 200,
    type: SubmissionDTO,
    isArray: true,
  })
  getAllSubmissionByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('offset') os: string,
    @Query('limit') lm: string,
  ) {
    const offset: number = parseInt(os);
    const limit: number = parseInt(lm);
    if ((os && isNaN(offset)) || (lm && isNaN(limit)))
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );

    return this.submissionService.findAllByUserIdWithOutContest(
      userId,
      offset,
      limit,
    );
  }

  @Get('/:resultId')
  @ApiResponse({
    status: 200,
    type: SubmissionWithSourceCodeDTO,
  })
  getSubmissionById(@Param('resultId', ParseIntPipe) resultId: number) {
    return this.submissionService.findOneByResultId(resultId);
  }
}
