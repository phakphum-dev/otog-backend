import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  CreateUserDTO,
  LoginReqDTO,
  AuthResDTO,
  SignupResDTO,
} from './dto/auth.dto';
import { JwtRefreshTokenAuthGuard } from '../../core/guards/jwt-refreshtoken-auth.guard';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { Public } from '../../core/decorators/isPublic.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { UserDTO } from '../user/dto/user.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  @ApiBody({
    type: CreateUserDTO,
  })
  @ApiResponse({
    status: 201,
    type: SignupResDTO,
  })
  newUser(@Body() data: CreateUserDTO) {
    return this.authService.signup(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({
    type: LoginReqDTO,
  })
  @ApiResponse({
    type: AuthResDTO,
  })
  async login(@User() userData: UserDTO, @Res() res: Response) {
    const { token, user } = await this.authService.login(userData);
    const authResDTO = new AuthResDTO();
    authResDTO.user = user;
    authResDTO.accessToken = token.accessToken;
    return res
      .cookie('RID', token.refreshToken, { httpOnly: true })
      .json(authResDTO);
  }

  @UseGuards(JwtRefreshTokenAuthGuard)
  @Get('/refresh/token')
  @ApiResponse({
    type: AuthResDTO,
  })
  async refreshToken(@User() userData: UserDTO, @Res() res: Response) {
    const { token, user } = await this.authService.reAccessToken(userData);
    const authResDTO = new AuthResDTO();
    authResDTO.user = user;
    authResDTO.accessToken = token.accessToken;
    return res
      .cookie('RID', token.refreshToken, { httpOnly: true })
      .json(authResDTO);
  }
}
