import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { JWT_PUBLIC } from 'src/core/constants';
import { UserDTO } from '../user/dto/user.dto';
import { JwtPayloadDTO } from './dto/auth.dto';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: JWT_PUBLIC,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadDTO): Promise<UserDTO> {
    const refreshTokenId = req.cookies['RID'];
    const { jti, id } = payload;
    if (!(await this.authService.validateToken(refreshTokenId, jti))) {
      throw new ForbiddenException();
    }
    const user = await this.userService.findOneById(id);
    const userAuthDTO = new UserDTO(user);
    return userAuthDTO;
  }
}
