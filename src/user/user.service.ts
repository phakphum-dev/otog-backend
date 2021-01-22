import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: ['id', 'username', 'showName', 'state', 'rating', 'history'],
    });
  }

  findOne(arg: any): Promise<User> {
    return this.userModel.findOne({
      attributes: ['id', 'username', 'showName', 'state', 'rating', 'history'],
      where: arg,
    });
  }
}
