import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class UserDTO {
  @ApiProperty()
  id: number;

  username: string;

  showName: string;

  role: string;

  rating: number;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.showName = user.showName;
    this.role = user.role;
    this.rating = user.rating;
  }
}
