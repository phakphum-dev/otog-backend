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

  @Get('/:contestId')
  getContestById(@Param('contestId') contestId: number) {
    return this.contestService.findOne({ contestId })
  }

  @Get('/:contestId/submission')
  getContestSubmissionById(@Param('contestId') contestId: number) {
    return 'unfinish'
  }

  @Get('/:contestId/scoreboard')
  getContestScoreBoardById(@Param('contestId') contestId: number) {
    return 'unfinish'
  }

}
