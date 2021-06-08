import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { CHAT_REPOSITORY } from 'src/core/constants';
import { Chat } from 'src/entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(@Inject(CHAT_REPOSITORY) private chatRepository: typeof Chat) {}

  async create(message: string, userId: number) {
    const chat = new Chat();
    chat.message = message;
    chat.userId = userId;
    return await chat.save();
  }

  async findAll(offset: number, limit: number): Promise<Chat[]> {
    return this.chatRepository.scope('full').findAll({
      where: {
        id: {
          [Op.lt]: offset || 1e9,
        },
      },
      limit: limit || 23,
    });
  }
}
