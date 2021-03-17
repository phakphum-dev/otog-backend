import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { sha256 } from 'js-sha256';
import { REFRESHTOKEN_REPOSITORY } from 'src/core/constants';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';
import { CreateUserDTO, UserAuthDTO } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject(REFRESHTOKEN_REPOSITORY)
    private refreshTokenRepository: typeof RefreshToken,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  async validateUser(username: string, pass: string): Promise<UserAuthDTO> {
    const user = await this.userService.findOneByUsername(username);
    const hash = sha256.create();
    hash.update(pass);
    if (user?.password === hash.hex()) {
      const userAuthDTO = new UserAuthDTO();
      userAuthDTO.id = user.id;
      userAuthDTO.username = user.username;
      userAuthDTO.showName = user.showName;
      userAuthDTO.role = user.role;
      userAuthDTO.rating = user.rating;
      return userAuthDTO;
    }
    return null;
  }

  async login(user: any) {
    const token = await this.generateToken(user);
    return { token, user };
  }

  async reAccessToken(user: any) {
    const token = await this.generateToken(user);
    return { token, user };
  }

  async generateToken(user: UserAuthDTO) {
    const payload = {
      id: user.id,
      username: user.username,
      showName: user.showName,
      role: user.role,
      rating: user.rating,
    };
    const jwtId = uuidv4();
    const accessToken = this.jwtService.sign(payload, {
      jwtid: jwtId,
    });

    const refreshToken = await this.generateRefreshToken(user, jwtId);
    return { accessToken, refreshToken };
  }

  async generateRefreshToken(
    user: UserAuthDTO,
    jwtId: string,
  ): Promise<string> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    const refreshToken = new RefreshToken();
    refreshToken.id = uuidv4();
    refreshToken.userId = user.id;
    refreshToken.jwtId = jwtId;
    refreshToken.expiryDate = expiryDate;
    await refreshToken.save();
    return refreshToken.id;
  }

  async validateToken(refreshTokenId: string, jwtId: any) {
    // fetch refreshToken
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: refreshTokenId },
    });

    //check refresh token is valid and match jwt
    if (!this.isRefreshTokenLinkedToToken(refreshToken, jwtId)) {
      return false;
    }

    //check refresh expire
    if (!this.isRefreshTokenExpired(refreshToken)) {
      return false;
    }

    //check refresh token used
    if (!this.isRefreshTokenUsed(refreshToken)) {
      return false;
    }

    await this.refreshTokenRepository.update(
      {
        used: true,
      },
      { where: { id: refreshTokenId } },
    );

    return true;
  }

  isRefreshTokenLinkedToToken(refreshToken: RefreshToken, jwtId: string) {
    if (!refreshToken) return false;
    if (refreshToken.jwtId != jwtId) return false;
    return true;
  }

  isRefreshTokenExpired(refreshToken: RefreshToken) {
    const now = new Date();
    if (!refreshToken) return false;
    if (refreshToken.expiryDate < now) return false;
    return true;
  }

  isRefreshTokenUsed(refreshToken: RefreshToken) {
    if (refreshToken.used) return false;
    return true;
  }
}
