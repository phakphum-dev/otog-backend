import { ApiProperty, PickType } from '@nestjs/swagger';
import { Status } from 'src/core/constants';
import { ProblemDTO } from 'src/modules/problem/dto/problem.dto';
import { UserDTO } from 'src/modules/user/dto/user.dto';

export class SubmissionDTO {
  @ApiProperty()
  readonly id: number;

  readonly result: string;

  readonly score: number;

  readonly timeUsed: number;

  readonly status: Status;

  readonly errmsg: string | null;

  readonly contestId: number | null;

  readonly language: string;

  readonly creationDate: Date;

  readonly problem: ProblemDTO;

  readonly user: UserDTO;
}

export class SubmissionForScoreboardDTO extends PickType(SubmissionDTO, [
  'id',
  'score',
  'timeUsed',
  'status',
] as const) {
  readonly problemId: number;
}

export class SubmissionWithSourceCodeDTO extends SubmissionDTO {
  readonly sourceCode: string;
}

export class UploadFileDTO {
  @ApiProperty()
  readonly language: string;

  readonly contestId?: number;

  readonly sourceCode: Object;
}
