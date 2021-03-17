import { Inject, Injectable } from '@nestjs/common';
import { sha256 } from 'js-sha256';
import { USER_REPOSITORY } from 'src/core/constants';
import { User } from '../../entities/user.entity';
import { CreateUserDTO } from '../auth/dto/auth.dto';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  async create(data: CreateUserDTO) {
    const userExists = await this.findOneByUsername(data.username);
    if (userExists) {
      return { msg: 'User already registered', status: false };
    } else {
      const hash = sha256.create();
      hash.update(data.password);
      const user = new User();
      user.username = data.username;
      user.password = hash.hex();
      user.showName = data.showName;
      user.role = 'user';
      await user.save();
      return { message: 'Create user complete.', status: true };
    }
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

  async getUserProfileById(id: number): Promise<UserDTO> {
    const user = await this.findOneById(id);
    const userDTO = new UserDTO(user);
    return userDTO;
  }
}
