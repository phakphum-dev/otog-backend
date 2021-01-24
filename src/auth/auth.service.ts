import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { sha256 } from 'js-sha256';
import { User } from 'src/models/user.model';
import { uid } from 'rand-token';
import { Session } from 'src/models/session.model';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Session) private sessionModel: typeof Session,
    private jwtService: JwtService,
  ) {}
  async create(username: string, password: string, showName: string) {
    const userExists = await this.userModel.findOne({ where: { username } });
    if (userExists) {
      return { msg: 'User already registered', status: false };
    } else {
      const hash = sha256.create();
      hash.update(password);
      const user = new User();
      user.username = username;
      user.password = hash.hex();
      user.showName = showName;
      const userData = await user.save();
      return { userData, status: true };
    }
  }

  async validateUser(username: string, pass: string) {
    const user = await this.userModel.findOne({ where: { username } });
    const hash = sha256.create();
    hash.update(pass);
    if (user?.password === hash.hex()) {
      const result = {
        id: user.id,
        username: user.username,
        showNmae: user.showName,
        state: user.state,
        rating: user.rating,
        history: user.history,
      };
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      showName: user.showName,
      state: user.state,
      rating: user.rating,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(user.id),
    };
  }

  async reAccessToken(user: any) {
    const payload = {
      id: user.id,
      username: user.username,
      showName: user.showName,
      state: user.state,
      rating: user.rating,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = uid(256);
    const session = new Session();
    session.refreshToken = refreshToken;
    session.userId = userId;
    session.loginTime = Math.floor(Date.now() / 1000);
    session.expiresTime = Math.floor(Date.now() / 1000) + 3 * 60 * 60;
    await session.save();
    return refreshToken;
  }

  sessionFindOneByRefreshToken(refreshToken: string): Promise<Session> {
    return this.sessionModel.findOne({
      where: {
        refreshToken,
      },
    });
  }
}
