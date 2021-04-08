import { ApiProperty } from '@nestjs/swagger';
import { ContestMode, GradingMode } from 'src/core/constants';
import { ProblemDTO } from 'src/modules/problem/dto/problem.dto';

export class ContestDTO {
  @ApiProperty()
  readonly id: number;

  readonly name: string;

  readonly mode: ContestMode;

  readonly gradingMode: GradingMode;

  readonly timeStart: Date;

  readonly timeEnd: Date;

  readonly problem: ProblemDTO[] | undefined;
}

export class CreateContestDTO {
  @ApiProperty()
  readonly name: string;

  readonly mode: ContestMode;

  readonly gradingMode: GradingMode;

  readonly timeStart: Date;

  readonly timeEnd: Date;
}
