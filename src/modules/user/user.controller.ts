import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UserDTO,
    isArray: true,
  })
  getAllUsers(): Promise<UserDTO[]> {
    return this.userService.findAll();
  }

  @Get('/:userId')
  @ApiResponse({
    status: 200,
    type: UserDTO,
  })
  getUserById(@Param('userId') userId: number): Promise<UserDTO> {
    return this.userService.getUserProfileById(userId);
  }
}
