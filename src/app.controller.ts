import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/time')
  @ApiOkResponse({
    description: 'Get server time',
    type: String,
  })
  serverTime() {
    return new Date();
  }
}
