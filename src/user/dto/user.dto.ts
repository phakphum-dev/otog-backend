import { ApiProperty } from '@nestjs/swagger';

class ContestHistory {
  id: number;

  conName: string;

  y: number;

  x: number;

  rank: number;
}

export class UserDto {
  @ApiProperty()
  readonly id: number;

  readonly username: string;

  readonly showName: string;

  readonly state: number;

  readonly rating: number;

  readonly history: ContestHistory[];
}
