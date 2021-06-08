import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { ChatService } from './chat.service';
import { ChatDTO } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(RolesGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ChatDTO,
  })
  getAllChat(@Query('offset') os: number, @Query('limit') lm: number) {
    const offset: number = +os;
    const limit: number = +lm;
    if ((os && isNaN(offset)) || (lm && isNaN(limit)))
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    return this.chatService.findAll(offset, limit);
  }
}
