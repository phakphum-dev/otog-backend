import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/modules/user/dto/user.dto';

export class ChatDTO {
  @ApiProperty()
  readonly id: number;

  readonly message: string;

  readonly creationDate: Date;

  readonly user: UserDTO;
}
