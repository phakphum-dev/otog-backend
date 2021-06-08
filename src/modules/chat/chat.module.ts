import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_PRIVATE } from 'src/core/constants';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { chatProvider } from './chat.provider';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  imports: [
    JwtModule.register({
      secret: JWT_PRIVATE,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '10m',
      },
    }),
  ],
  providers: [ChatService, ChatGateway, ...chatProvider],
})
export class ChatModule {}
