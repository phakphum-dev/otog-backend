import { ApiProperty } from '@nestjs/swagger';

export class ProblemDto {
  @ApiProperty()
  readonly id: number;

  readonly name: string;

  readonly sname: string;

  readonly score: number;

  readonly timeLimit: number;

  readonly memoryLimit: number;

  readonly show: boolean;

  readonly recentShowTime: Date;

  readonly case: string;

  readonly rating: number;
}
