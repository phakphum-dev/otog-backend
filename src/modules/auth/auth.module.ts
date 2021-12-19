import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { authProvider } from './auth.provider';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './jwt.refreshtoken.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [PassportModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    ...authProvider,
  ],
  exports: [AuthService],
})
export class AuthModule {}
