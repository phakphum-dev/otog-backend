import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  CreateUserDTO,
  LoginReqDTO,
  AuthResDTO,
  SignupResDTO,
} from './dto/auth.dto';
import { JwtRefreshTokenAuthGuard } from '../../core/guards/jwt-refreshtoken-auth.guard';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';

@ApiBearerAuth()
@ApiTags('auth')
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
  async login(@Req() req: Request, @Res() res: Response) {
    const { token, user } = await this.authService.login(req.user);
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
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { token, user } = await this.authService.login(req.user);
    const authResDTO = new AuthResDTO();
    authResDTO.user = user;
    authResDTO.accessToken = token.accessToken;
    return res
      .cookie('RID', token.refreshToken, { httpOnly: true })
      .json(authResDTO);
  }
}
