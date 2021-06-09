import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/core/constants';
import { Roles } from 'src/core/decorators/roles.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { PatchShowNameDTO, UserDTO, UserProfileDTO } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkResponse({
    type: UserDTO,
    isArray: true,
    description: 'Get all registered users',
  })
  getAllUsers(): Promise<UserDTO[]> {
    return this.userService.findAll();
  }

  @Get('/online')
  @ApiOkResponse({
    type: UserDTO,
    isArray: true,
    description: 'Get online users',
  })
  getOnlineUser() {
    return this.userService.onlineUser();
  }

  // @Get('/:userId')
  // @ApiResponse({
  //   status: 200,
  //   type: UserDTO,
  // })
  // getUserById(@Param('userId') userId: number): Promise<UserDTO> {
  //   return this.userService.getUserProfileById(userId);
  // }

  @Roles(Role.Admin, Role.User)
  @Patch('/:userId/name')
  @ApiBody({ type: PatchShowNameDTO })
  @ApiOkResponse({
    type: UserDTO,
    description: 'showName changed successfully',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'showName already exists' })
  @ApiNotFoundResponse({ description: 'User not found' })
  updateShowName(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('showName') showName: string,
    @User() user: UserDTO,
  ) {
    if (user.role !== Role.Admin && user.id !== userId) {
      throw new ForbiddenException();
    }
    return this.userService.updateShowNameById(showName, userId);
  }

  @Get('/:userId/profile')
  @ApiOkResponse({ type: UserProfileDTO })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserProfileById(@Param('userId', ParseIntPipe) userId: number) {
    const userProfile = await this.userService.getUserProfileById(userId);
    if (!userProfile) throw new NotFoundException();
    return userProfile;
  }
}
