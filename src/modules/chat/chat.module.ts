import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { chatProvider } from './chat.provider';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ...chatProvider],
})
export class ChatModule {}
