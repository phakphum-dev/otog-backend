import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService
  ) {}
  async create(username: string, password: string, showName: string) {
    const userExists = await this.userModel.findOne({ where: { username } });
    if (userExists) {
      return { msg: 'User already registered', status: false };
    } else {
      const user = new User();
      user.username = username;
      user.password = password;
      user.showName = showName;
      const userData = await user.save();
      return { userData, status: true };
    }
  }

  async validateUser(username: string, pass: string) {
    const user = await this.userModel.findOne({ where: {username} })
    if (user?.password === pass) {
      const result = {
        idUser: user.idUser,
        username: user.username,
        showNmae: user.showName,
        state: user.state,
        rating: user.rating,
        history: user.history
      }
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = {
      idUser: user.idUser,
      username: user.username,
      showName: user.showName,
      state: user.state,
      rating: user.rating
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
