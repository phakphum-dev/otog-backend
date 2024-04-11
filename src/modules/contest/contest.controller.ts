import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessState, Role } from 'src/core/constants';
import { OfflineAccess } from 'src/core/decorators/offline-mode.decorator';
import { Roles } from 'src/core/decorators/roles.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Contest } from 'src/entities/contest.entity';
import { UserDTO } from '../user/dto/user.dto';
import { ContestService } from './contest.service';
import {
  ContestDTO,
  CreateContestDTO,
  CurrentContestDTO,
  PatchContestDTO,
  ResPatchContestDTO,
  ScoreboardDTO,
  ScoreboardPrizeDTO,
  UpdateContestDTO,
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

  @OfflineAccess(AccessState.Authenticated)
  @Get('/now')
  @ApiOkResponse({
    type: CurrentContestDTO,
    description: 'Get current contest',
  })
  async getCurrentContest() {
    // TODO not private
    return {
      currentContest: await this.contestService.currentContest(),
    };
  }

  @OfflineAccess(AccessState.Authenticated)
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
    @User() user?: UserDTO,
  ) {
    let contest: Contest;
    try {
      contest = await this.contestService.scoreboardByContestId(contestId);
    } catch (e: unknown) {
      throw new NotFoundException();
    }
    // TODO validate user if contest is private
    if (user?.role === Role.Admin || new Date() > new Date(contest.timeEnd)) {
      return contest;
    }
    throw new ForbiddenException();
  }

  @Get('/:contestId/prize')
  @ApiOkResponse({
    type: ScoreboardPrizeDTO,
    description: 'Get contest prize by id',
  })
  @ApiNotFoundResponse({ description: 'Contest not found' })
  async getContestPrizeById(
    @Param('contestId', ParseIntPipe) contestId: number,
  ) {
    // TODO validate user if contest is private
    try {
      return await this.contestService.scoreboardPrizeByContestId(contestId);
    } catch (e: unknown) {
      throw new NotFoundException();
    }
  }

  //  TODO have i join the contest

  //Admin Only

  @Roles(Role.Admin)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateContestDTO })
  @ApiCreatedResponse({ description: 'Contest created succussfully' })
  create(@Body() createContest: CreateContestDTO) {
    return this.contestService.create(createContest);
  }

  @Roles(Role.Admin)
  @Post('/:contestId')
  @ApiBearerAuth()
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
  @Put('/:contestId')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateContestDTO })
  @ApiResponse({
    status: 200,
    description: 'Update contest data',
    type: ContestDTO,
  })
  @ApiNotFoundResponse({ description: 'Contest not found' })
  updateContest(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Body() contestData: UpdateContestDTO,
  ) {
    return this.contestService.updateContest(contestId, contestData);
  }

  @Roles(Role.Admin)
  @Delete('/:contestId')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Delete contest',
    type: ContestDTO,
  })
  @ApiNotFoundResponse({ description: 'Contest not found' })
  deleteContest(@Param('contestId', ParseIntPipe) contestId: number) {
    return this.contestService.deleteContest(contestId);
  }

  @Roles(Role.Admin)
  @Post('/:contestId/signup')
  @ApiBearerAuth()
  addUserToContest(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.contestService.addUserToContest(contestId, userId);
  }

  //  TODO who have join the contest?
}
