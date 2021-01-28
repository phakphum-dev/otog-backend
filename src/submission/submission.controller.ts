import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import { diskStorage } from 'multer';
import {
  editDestPath,
  editFileName,
  scodeFileFilter,
} from 'src/utils/file-upload.utils';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SubmissionDto,
  SubmissionWithSourceCodeDto,
  UploadFileDto,
} from './dto/submission.dto';

@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: SubmissionDto,
    isArray: true,
  })
  getAllSubmission() {
    return this.submissionService.findAll();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDto,
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
  uploadFile(@UploadedFile() file, @Body() data: any) {
    const filename = file.filename;
    const timeSent = filename.substring(
      filename.indexOf('_') + 1,
      filename.indexOf('.'),
    );
    return this.submissionService.create(data, timeSent);
  }

  @Get('/:resultId')
  @ApiResponse({
    status: 200,
    type: SubmissionWithSourceCodeDto,
  })
  getSubmissionById(@Param('resultId') resultId: number) {
    return this.submissionService.findOneByResultId(resultId);
  }

  @Get('/user/:userId')
  @ApiResponse({
    status: 200,
    type: SubmissionDto,
    isArray: true,
  })
  getAllSubmissionByUserId(@Param('userId') userId: number) {
    return this.submissionService.findAllByUserId(userId);
  }

  @Get('/user/:userId/latest')
  @ApiResponse({
    status: 200,
    type: SubmissionDto,
  })
  getLatestSubmissionWithUserId(@Param('userId') userId: number) {
    return this.submissionService.latestSubmissionWithUserId(userId);
  }
}
