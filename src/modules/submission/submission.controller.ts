import {
  Body,
  Controller,
  Get,
  Param,
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
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return this.submissionService.findAllWithOutContest(offset, limit);
  }

  @Roles(Role.User, Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDTO,
  })
  @Post('/problem/:problemId')
  // @UseInterceptors(
  //   FileInterceptor('sourceCode', {
  //     storage: diskStorage({
  //       destination: editDestPath,
  //       filename: editFileName,
  //     }),
  //     fileFilter: scodeFileFilter,
  //   }),
  // )
  @UseInterceptors(FileInterceptor('sourceCode'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('problemId') problemId: number,
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

  @Get('/:resultId')
  @ApiResponse({
    status: 200,
    type: SubmissionWithSourceCodeDTO,
  })
  getSubmissionById(@Param('resultId') resultId: number) {
    return this.submissionService.findOneByResultId(resultId);
  }

  @Get('/user/:userId')
  @ApiResponse({
    status: 200,
    type: SubmissionDTO,
    isArray: true,
  })
  getAllSubmissionByUserId(@Param('userId') userId: number) {
    return this.submissionService.findAllByUserId(userId);
  }
}
