import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty()
  readonly username: string;

  readonly password: string;

  readonly showName: string;
}

export class LoginReqDTO {
  @ApiProperty()
  readonly username: string;

  readonly password: string;
}

export class AuthResDTO {
  user: UserAuthDTO;

  accessToken: string;
}

export class UserAuthDTO {
  @ApiProperty()
  id: number;

  username: string;

  showName: string;

  role: string;

  rating: number;
}

export class SignupResDTO {
  message: string;

  status: boolean;
}
