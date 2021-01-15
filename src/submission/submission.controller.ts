import { Controller, Get, Param } from '@nestjs/common';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
    constructor(private submissionService: SubmissionService) {}

    @Get()
    getAllSubmission() {
        return this.submissionService.findAll()
    }

    @Get('/:idResult')
    getSubmissionById(@Param('idResult') idResult: number) {
        return this.submissionService.findOne({idResult})
    }

    @Get('/user/:idUser')
    getAllSubmissionByIdUser(@Param('idUser') idUser: number) {
        return this.submissionService.findAllByIdUser(idUser)
    }
}
