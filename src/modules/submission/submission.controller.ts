import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import { diskStorage } from 'multer';
import {
  editDestPath,
  editFileName,
  scodeFileFilter,
} from 'src/utils/fileUpload.utils';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SubmissionDTO,
  SubmissionWithSourceCodeDTO,
  UploadFileDTO,
} from './dto/submission.dto';
import { Request } from 'express';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/constants';

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
  getAllSubmission() {
    return this.submissionService.findAllWithOutContest();
  }

  @Roles(Role.User, Role.Admin)
  @Post('/:problemId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDTO,
  })
  @UseInterceptors(
    FileInterceptor('sourceCode', {
      storage: diskStorage({
        destination: editDestPath,
        filename: editFileName,
      }),
      fileFilter: scodeFileFilter,
    }),
  )
  uploadFile(@Req() req: Request, @Body() data: any) {
    const problemId = Number(req.params?.problemId);
    const user = req.user;
    return this.submissionService.create(user, problemId, data);
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

  @Get('/user/:userId/latest')
  @ApiResponse({
    status: 200,
    type: SubmissionDTO,
  })
  getLatestSubmissionWithUserId(@Param('userId') userId: number) {
    return this.submissionService.findOneByUserId(userId);
  }
}
