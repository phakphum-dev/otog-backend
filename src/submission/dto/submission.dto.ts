import { ApiProperty } from '@nestjs/swagger';
import { ReturnProblemDto } from 'src/problem/dto/problem.dto';
import { ReturnUserDto } from 'src/user/dto/user.dto';

export class ReturnSubmissionDto {
  @ApiProperty()
  readonly id: number;

  readonly timeSent: number;

  readonly result: string;

  readonly score: number;

  readonly timeUsed: number;

  readonly errmsg: number | null;

  readonly contestId: number | null;

  readonly language: string;

  readonly isGrading: boolean;

  readonly problem: ReturnProblemDto;

  readonly user: ReturnUserDto;
}

export class ReturnSubmissionDtoWithSourceCode {
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

  readonly problem: ReturnProblemDto;

  readonly user: ReturnUserDto;
}

export class UploadFileDto {
  @ApiProperty()
  readonly probId: number;

  readonly userId: number;

  readonly language: string;

  readonly contestId: number | undefined;

  readonly sourceCode: any;
}
