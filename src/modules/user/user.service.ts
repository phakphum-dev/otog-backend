import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { sha256 } from 'js-sha256';
import { Op } from 'sequelize';
import { ContestMode, Role, USER_REPOSITORY } from 'src/core/constants';
import { Contest } from 'src/entities/contest.entity';
import { User } from '../../entities/user.entity';
import { CreateUserDTO } from '../auth/dto/auth.dto';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  async create(data: CreateUserDTO) {
    const userNameExists = await this.findOneByUsername(data.username);
    if (userNameExists) {
      throw new ConflictException('username was taken.');
    }
    const showNameExists = await this.findOneByShowName(data.showName);
    if (showNameExists) {
      throw new ConflictException('showName was taken.');
    }
    const hash = sha256.create();
    hash.update(data.password);
    try {
      const user = new User();
      user.username = data.username;
      user.password = hash.hex();
      user.showName = data.showName;
      user.role = Role.User;
      await user.save();
    } catch {
      throw new BadRequestException();
    }
    return { message: 'Create user complete.', status: true };
  }

  async findAll(): Promise<UserDTO[]> {
    const result = await this.userRepository.findAll();
    const userDTO = result.map((item) => new UserDTO(item));
    return userDTO;
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findOneByShowName(showName: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { showName },
    });
  }

  async getUserProfileById(id: number): Promise<User> {
    return await this.userRepository.scope('noPass').findOne({
      where: {
        id,
      },
      include: [
        {
          model: Contest,
          where: {
            mode: ContestMode.Rated,
          },
          through: {
            attributes: ['rank', 'ratingAfterUpdate'],
            as: 'detail',
            where: {
              rank: {
                [Op.not]: null,
              },
            },
          },
          attributes: ['id', 'name', 'timeEnd'],
          required: false,
        },
      ],
    });
  }
}
