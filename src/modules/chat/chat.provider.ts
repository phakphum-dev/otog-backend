import { CHAT_REPOSITORY } from 'src/core/constants';
import { Chat } from 'src/entities/chat.entity';

export const chatProvider = [
  {
    provide: CHAT_REPOSITORY,
    useValue: Chat,
  },
];
