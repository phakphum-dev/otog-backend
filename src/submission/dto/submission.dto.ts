import { ApiProperty } from '@nestjs/swagger';
import { ProblemDto } from 'src/problem/dto/problem.dto';
import { UserDto } from 'src/user/dto/user.dto';

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

  readonly user: UserDto;
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

  readonly user: UserDto;
}

export class UploadFileDto {
  @ApiProperty()
  readonly probId: number;

  readonly userId: number;

  readonly language: string;

  readonly contestId: number | undefined;

  readonly sourceCode: any;
}
