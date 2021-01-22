import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.public,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const session = await this.authService.sessionFindOneByRefreshToken(
      req.body.refreshToken,
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    if (session.userId != payload.id) {
      throw new UnauthorizedException();
    }
    if (Math.floor(Date.now() / 1000) > session.expiresTime) {
      throw new UnauthorizedException();
    }
    return { id: payload.id, username: payload.username, state: payload.state };
  }
}
