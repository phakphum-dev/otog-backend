import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UserDto,
    isArray: true,
  })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/:userId')
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  getUserById(@Param('userId') userId: number) {
    return this.userService.findOne({ id: userId });
  }
}
