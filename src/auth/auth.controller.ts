import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshTokenAuthGuard } from './jwt-refreshtoken-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  newUser(@Body() data: any) {
    return this.authService.create(data.username, data.password, data.showName);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('/refreshToken')
  refreshToken(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}
