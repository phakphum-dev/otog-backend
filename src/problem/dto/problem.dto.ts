import { ApiProperty } from '@nestjs/swagger';

export class ProblemDto {
  @ApiProperty()
  readonly id: number;

  readonly name: string;

  readonly sname: string;

  readonly score: number;

  readonly timeLimit: number;

  readonly memory: number;

  readonly state: number;

  readonly recentShowTime: number;

  readonly case: string;

  readonly rating: number;
}
