import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ContestMode, GradingMode } from 'src/core/constants';
import { ProblemDTO } from 'src/modules/problem/dto/problem.dto';
import { UserForScoreboardDTO } from 'src/modules/user/dto/user.dto';

class ContestDTOBase {
  readonly id: number;

  readonly name: string;

  readonly mode: ContestMode;

  readonly gradingMode: GradingMode;

  readonly timeStart: Date;

  readonly timeEnd: Date;
}

export class ContestDTO extends ContestDTOBase {
  @ApiProperty()
  readonly problems: ProblemDTO[] | undefined;
}

export class CurrentContestDTO {
  currentContest: ContestDTO;
}

export class UpdateContestDTO extends OmitType(ContestDTOBase, [
  'id',
] as const) {}

export class CreateContestDTO extends OmitType(ContestDTOBase, [
  'id',
] as const) {}

export class ScoreboardDTO extends ContestDTOBase {
  @ApiProperty()
  readonly problems: ProblemDTO[];

  readonly users: UserForScoreboardDTO[];
}

export class PatchContestDTO {
  problemId: number;
  show: boolean;
}

export class ResPatchContestDTO {
  contestId: number;
  problemId: number;
  show: boolean;
}

export class MiniSubmission {
  id: number;
  timeUsed?: number;
  problem: {
    id: number;
  };
  user: {
    id: number;
    showName: string;
  };
}
export class ScoreboardPrizeDTO {
  firstBlood: MiniSubmission[];
  fasterThanLight: MiniSubmission[];
  passedInOne: MiniSubmission[];
  oneManSolve: MiniSubmission[];
}
