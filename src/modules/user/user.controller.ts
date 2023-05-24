import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { RolesGuard } from 'src/core/guards/roles.guard';
import {
  PatchShowNameDTO,
  UpdateUserDTO,
  UserDTO,
  UserProfileDTO,
} from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.Admin)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserDTO,
    isArray: true,
    description: 'Get all registered users',
  })
  getAllUsers() {
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

  @Roles(Role.Admin)
  @Put('/:userId')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDTO })
  @ApiOkResponse({
    type: UserDTO,
    description: 'user update successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() userData: UpdateUserDTO,
  ) {
    try {
      return await this.userService.updateUser(userId, userData);
    } catch (e: unknown) {
      throw new NotFoundException('user not found');
    }
  }

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
