import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class UserDTO {
  @ApiProperty()
  readonly id: number;

  readonly username: string;

  readonly showName: string;

  readonly role: string;

  readonly rating: number;

  readonly attendedContest: any;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.showName = user.showName;
    this.role = user.role;
    this.rating = user.rating;
    this.attendedContest = user.attendedContest;
  }
}
