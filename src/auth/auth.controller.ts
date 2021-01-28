import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUser, UserTokens, UserLogin } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshTokenAuthGuard } from './jwt-refreshtoken-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  @ApiBody({
    type: CreateUser,
  })
  newUser(@Body() data: any) {
    return this.authService.create(data.username, data.password, data.showName);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({
    type: UserLogin,
  })
  @ApiResponse({
    type: UserTokens,
  })
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('/refreshToken')
  refreshToken(@Req() req: Request) {
    return this.authService.reAccessToken(req.user);
  }
}
