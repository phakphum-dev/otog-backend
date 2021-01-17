import { Controller, Get, Param } from '@nestjs/common';
import { ContestService } from './contest.service';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  @Get()
  getAllContest() {
    return this.contestService.findAll()
  }

  @Get('/now')
  getCurrentContest() {
    return this.contestService.currentContest()
  }

  @Get('/:idContest')
  getContestById(@Param('idContest') idContest: number) {
    return this.contestService.findOne({ idContest })
  }

  @Get('/:idContest/submission')
  getContestSubmissionById(@Param('idContest') idContest: number) {
    return 'unfinish'
  }

  @Get('/:idContest/scoreboard')
  getContestScoreBoardById(@Param('idContest') idContest: number) {
    return 'unfinish'
  }

}
