import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ContestService } from './contest.service';

@ApiTags('contest')
@Controller('contest')
@UseGuards(JwtAuthGuard)
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
