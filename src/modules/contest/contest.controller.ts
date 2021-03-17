import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContestService } from './contest.service';

@ApiTags('contest')
@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  @Get()
  getAllContest() {
    return this.contestService.findAll();
  }

  @Get('/now')
  getCurrentContest() {
    return this.contestService.currentContest();
  }

  @Get('/:contestId')
  getContestById(@Param('contestId') contestId: number) {
    return this.contestService.findOneById(contestId);
  }

  @Get('/:contestId/submission')
  getContestSubmissionById(@Param('contestId') contestId: number) {
    return 'unfinish';
  }

  @Get('/:contestId/scoreboard')
  getContestScoreBoardById(@Param('contestId') contestId: number) {
    return 'unfinish';
  }
}
