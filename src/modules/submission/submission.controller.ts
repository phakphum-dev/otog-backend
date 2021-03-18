import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  SubmissionDto,
  SubmissionWithSourceCodeDto,
  UploadFileDto,
} from './dto/submission.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@ApiTags('submission')
@Controller('submission')
@UseGuards(JwtAuthGuard)
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: SubmissionDto,
    isArray: true,
  })
  getAllSubmission() {
    return this.submissionService.findAllWithContest();
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
  uploadFile(@Body() data: any) {
    return this.submissionService.create(data);
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
    return this.submissionService.findOneByUserId(userId);
  }
}
