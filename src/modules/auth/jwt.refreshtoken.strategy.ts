import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserAuthDTO } from './dto/auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { JWT_PUBLIC } from 'src/core/constants';

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

  async validate(req: Request, payload: any): Promise<UserAuthDTO> {
    const refreshTokenId = req.cookies['RID'];
    const { jti, id } = payload;
    if (!(await this.authService.validateToken(refreshTokenId, jti))) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOneById(id);
    const userAuthDTO = new UserAuthDTO();
    userAuthDTO.id = user.id;
    userAuthDTO.username = user.username;
    userAuthDTO.showName = user.showName;
    userAuthDTO.role = user.role;
    userAuthDTO.rating = user.rating;
    return userAuthDTO;
  }
}
