import { ApiProperty } from '@nestjs/swagger';

export class CreateUser {
  @ApiProperty()
  readonly username: string;

  readonly password: string;

  readonly showName: string;
}

export class UserLogin {
  @ApiProperty()
  readonly username: string;

  readonly password: string;
}

export class UserTokens {
  @ApiProperty()
  readonly accessToken: string;

  readonly refreshToken: string;
}
