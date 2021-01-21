import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import { diskStorage } from 'multer';
import { editDestPath, editFileName, scodeFileFilter } from 'src/utils/file-upload.utils';

@Controller('submission')
export class SubmissionController {
    constructor(private submissionService: SubmissionService) {}

    @Get()
    getAllSubmission() {
        return this.submissionService.findAll()
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('scode', {
            storage: diskStorage({
                destination: editDestPath,
                filename: editFileName
            }),
            fileFilter: scodeFileFilter
        }))
    uploadFile(@UploadedFile() file, @Body() data: any) {
        const filename = file.filename
        const time = filename.substring(filename.indexOf('_')+1, filename.indexOf('.'));
        return this.submissionService.create(data,time)     
    }

    @Get('/:resultId')
    getSubmissionById(@Param('resultId') resultId: number) {
        return this.submissionService.findOneByResultId(resultId)
    }

    @Get('/user/:userId')
    getAllSubmissionByUserId(@Param('userId') userId: number) {
        return this.submissionService.findAllByUserId(userId)
    }

}
