import { ApiProperty } from '@nestjs/swagger';
import { ProblemDto } from 'src/modules/problem/dto/problem.dto';
import { UserDTO } from 'src/modules/user/dto/user.dto';

export class SubmissionDto {
  @ApiProperty()
  readonly id: number;

  readonly timeSent: number;

  readonly result: string;

  readonly score: number;

  readonly timeUsed: number;

  readonly errmsg: string | null;

  readonly contestId: number | null;

  readonly language: string;

  readonly isGrading: boolean;

  readonly problem: ProblemDto;

  readonly user: UserDTO;
}

export class SubmissionWithSourceCodeDto {
  @ApiProperty()
  readonly id: number;

  readonly timeSent: number;

  readonly result: string;

  readonly score: number;

  readonly timeUsed: number;

  readonly errmsg: string | null;

  readonly contestId: number | null;

  readonly language: string;

  readonly isGrading: boolean;

  readonly sourceCode: string;

  readonly problem: ProblemDto;

  readonly user: UserDTO;
}

export class UploadFileDto {
  @ApiProperty()
  readonly probId: number;

  readonly userId: number;

  readonly language: string;

  readonly contestId: number | undefined;

  readonly sourceCode: any;
}
