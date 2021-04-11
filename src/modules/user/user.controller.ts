import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserDTO, UserProfileDTO } from './dto/user.dto';
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

  // @Get('/:userId')
  // @ApiResponse({
  //   status: 200,
  //   type: UserDTO,
  // })
  // getUserById(@Param('userId') userId: number): Promise<UserDTO> {
  //   return this.userService.getUserProfileById(userId);
  // }

  @Get('/:userId/profile')
  @ApiResponse({
    status: 200,
    type: UserProfileDTO,
  })
  getUserProfileById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return this.userService.getUserProfileById(userId);
  }
}
