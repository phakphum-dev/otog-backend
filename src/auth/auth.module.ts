import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Session } from 'src/models/session.model';
import { User } from 'src/models/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtRefreshTokenStrategy } from './jwt.refreshtoken.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Session]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.private,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '10m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
