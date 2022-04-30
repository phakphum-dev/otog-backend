import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AccessState } from './core/constants';
import { OfflineAccess } from './core/decorators/offline-mode.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @OfflineAccess(AccessState.Public)
  @Get('/time')
  @ApiOkResponse({
    description: 'Get server time',
    type: String,
  })
  serverTime() {
    return new Date();
  }

  @Get('/ping')
  pingServer() {
    return 'pong';
  }
}
