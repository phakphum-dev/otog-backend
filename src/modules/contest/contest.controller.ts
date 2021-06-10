import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOkResponse({
    type: ContestDTO,
    isArray: true,
    description: 'Get all contests',
  })
  getAllContest() {
    return this.contestService.findAll();
  }

  @Get('/now')
  @ApiOkResponse({
    type: ContestDTO,
    description: 'Get current contest',
  })
  getCurrentContest() {
    return this.contestService.currentContest();
  }

  @Get('/:contestId')
  @ApiOkResponse({
    type: ContestDTO,
    description: 'Get contest by id',
  })
  @ApiNotFoundResponse({ description: 'Contest not found' })
  getContestById(@Param('contestId', ParseIntPipe) contestId: number) {
    return this.contestService.findOneById(contestId);
  }

  @Get('/:contestId/scoreboard')
  @ApiOkResponse({
    type: ScoreboardDTO,
    description: 'Get scoreboard contest by id',
  })
  @ApiNotFoundResponse({ description: 'Contest not found' })
  async getContestScoreBoardById(
    @Param('contestId', ParseIntPipe) contestId: number,
  ) {
    const scoreboard = await this.contestService.scoreboardByContestId(
      contestId,
    );
    if (!scoreboard) throw new NotFoundException();
    return scoreboard;
  }

  //Admin Only

  @Roles(Role.Admin)
  @Post()
  @ApiBody({ type: CreateContestDTO })
  @ApiCreatedResponse({ description: 'Contest created succussfully' })
  create(@Body() createContest: CreateContestDTO) {
    return this.contestService.create(createContest);
  }

  @Roles(Role.Admin)
  @Patch('/:contestId')
  @ApiBody({ type: PatchContestDTO })
  @ApiResponse({
    status: 200,
    type: ResPatchContestDTO,
  })
  @ApiNotFoundResponse({ description: 'Contest not found' })
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
