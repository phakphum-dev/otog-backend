import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JWT_PRIVATE } from 'src/core/constants';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { authProvider } from './auth.provider';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './jwt.refreshtoken.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: JWT_PRIVATE,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '10m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    ...authProvider,
  ],
})
export class AuthModule {}
