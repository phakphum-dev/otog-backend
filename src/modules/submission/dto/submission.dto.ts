import { ApiProperty } from '@nestjs/swagger';
import { ProblemDto } from 'src/modules/problem/dto/problem.dto';
import { UserDTO } from 'src/modules/user/dto/user.dto';

export class SubmissionDTO {
  @ApiProperty()
  readonly id: number;

  readonly result: string;

  readonly score: number;

  readonly timeUsed: number;

  readonly isGrading: boolean;

  readonly errmsg: string | null;

  readonly contestId: number | null;

  readonly language: string;

  readonly creationDate: Date;

  readonly problem: ProblemDto;

  readonly user: UserDTO;
}

export class SubmissionWithSourceCodeDTO {
  @ApiProperty()
  readonly id: number;

  readonly result: string;

  readonly score: number;

  readonly timeUsed: number;

  readonly isGrading: boolean;

  readonly errmsg: string | null;

  readonly contestId: number | null;

  readonly language: string;

  readonly creationDate: Date;

  readonly sourceCode: string;

  readonly problem: ProblemDto;

  readonly user: UserDTO;
}

export class UploadFileDTO {
  @ApiProperty()
  readonly language: string;

  readonly contestId: number | undefined;

  readonly sourceCode: Object;
}
