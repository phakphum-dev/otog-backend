import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/core/constants';
import { Roles } from 'src/core/decorators/roles.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { ContestService } from './contest.service';
import { ContestDTO, CreateContestDTO } from './dto/contest.dto';

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
  getContestScoreBoardById(
    @Param('contestId', ParseIntPipe) contestId: number,
  ) {
    return 'unfinish';
  }

  //Admin Only

  // @Roles(Role.Admin)
  @Post()
  create(@Body() createContest: CreateContestDTO) {
    return this.contestService.create(createContest);
  }

  // @Roles(Role.Admin)
  @Patch('/:contestId')
  addProblemToContest(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Body('problemId', ParseIntPipe) problemId: number,
  ) {
    return this.contestService.addProblemToContest(contestId, problemId);
  }
}
