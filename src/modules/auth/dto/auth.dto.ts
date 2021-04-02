import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/core/constants';
import { UserDTO } from 'src/modules/user/dto/user.dto';

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
  user: UserDTO;

  accessToken: string;
}

export class JwtPayloadDTO {
  id: number;

  username: string;

  showName: string;

  role: Role;

  rating: number | null;

  iat: number;

  exp: number;

  jti: string;
}

// export class UserAuthDTO {
//   @ApiProperty()
//   id: number;

//   username: string;

//   showName: string;

//   role: string;

//   rating: number;
// }

export class SignupResDTO {
  message: string;

  status: boolean;
}
