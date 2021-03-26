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
  uploadFile(
    @Param('problemId') problemId: number,
    @User() user: UserDTO,
    @Body() data: any,
  ) {
    return this.submissionService.create(user, problemId, data);
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
