import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/core/constants';
import { Roles } from 'src/core/decorators/roles.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { ContestService } from './contest.service';
import {
  ContestDTO,
  CreateContestDTO,
  PatchContestDTO,
  ResPatchContestDTO,
  ScoreboardDTO,
} from './dto/contest.dto';

@ApiTags('contest')
@Controller('contest')
@UseGuards(RolesGuard)
export class ContestController {
  constructor(private contestService: ContestService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ContestDTO,
    isArray: true,
  })
  getAllContest() {
    return this.contestService.findAll();
  }

  @Get('/now')
  @ApiResponse({
    status: 200,
    type: ContestDTO,
  })
  getCurrentContest() {
    return this.contestService.currentContest();
  }

  @Get('/:contestId')
  @ApiResponse({
    status: 200,
    type: ContestDTO,
  })
  getContestById(@Param('contestId', ParseIntPipe) contestId: number) {
    return this.contestService.findOneById(contestId);
  }

  @Get('/:contestId/scoreboard')
  @ApiResponse({
    status: 200,
    type: ScoreboardDTO,
  })
  getContestScoreBoardById(
    @Param('contestId', ParseIntPipe) contestId: number,
  ) {
    return this.contestService.scoreboardByContestId(contestId);
  }

  //Admin Only

  @Roles(Role.Admin)
  @Post()
  @ApiBody({
    type: CreateContestDTO,
  })
  create(@Body() createContest: CreateContestDTO) {
    return this.contestService.create(createContest);
  }

  @Roles(Role.Admin)
  @Patch('/:contestId')
  @ApiBody({
    type: PatchContestDTO,
  })
  @ApiResponse({
    status: 200,
    type: ResPatchContestDTO,
  })
  addProblemToContest(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Body('problemId', ParseIntPipe) problemId: number,
    @Body('show', ParseBoolPipe) show: boolean,
  ) {
    return this.contestService.addProblemToContest(contestId, problemId, show);
  }

  @Roles(Role.Admin)
  @Post('/:contestId/signup')
  addUserToContest(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.contestService.addUserToContest(contestId, userId);
  }
}
