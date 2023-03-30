import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessState, Role } from 'src/core/constants';
import { OfflineAccess } from 'src/core/decorators/offline-mode.decorator';
import { Roles } from 'src/core/decorators/roles.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UserDTO } from '../user/dto/user.dto';
import { AnnouncementService } from './announcement.service';
import {
  AnnouncementDTO,
  CreateAnnouncementDTO,
  ToggleAnnouncementDTO,
  UpdateAnnouncementDTO,
} from './dto/announcement.dto';

@ApiBearerAuth()
@ApiTags('announcement')
@Controller('announcement')
@UseGuards(RolesGuard)
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @OfflineAccess(AccessState.Authenticated)
  @Get()
  @ApiOkResponse({
    type: AnnouncementDTO,
    isArray: true,
    description: 'Get announcements depending on user permission',
  })
  getAllAnnouncement(@User() user: UserDTO) {
    return user?.role === Role.Admin
      ? this.announcementService.findAll()
      : this.announcementService.findShown();
  }

  @Roles(Role.Admin)
  @Post()
  @ApiCreatedResponse({
    type: AnnouncementDTO,
    description: 'Create new announcement',
  })
  @ApiBody({
    type: CreateAnnouncementDTO,
  })
  createAnnouncement(@Body('value') value: object) {
    return this.announcementService.create(value);
  }

  @Roles(Role.Admin)
  @Delete('/:announcementId')
  @ApiOkResponse({
    type: AnnouncementDTO,
    description: 'Delete announcement by id',
  })
  @ApiNotFoundResponse({ description: 'Announcement not found' })
  deleteAnnouncement(
    @Param('announcementId', ParseIntPipe) announcementId: number,
  ) {
    return this.announcementService.delete(announcementId);
  }

  @Roles(Role.Admin)
  @Patch('/:announcementId')
  @ApiOkResponse({
    type: AnnouncementDTO,
    description: 'Update visibility of announcement by id',
  })
  @ApiBody({
    type: ToggleAnnouncementDTO,
  })
  @ApiNotFoundResponse({ description: 'Announcement not found' })
  patchAnnouncement(
    @Param('announcementId', ParseIntPipe) announcementId: number,
    @Body('show', ParseBoolPipe) show: boolean,
  ) {
    return this.announcementService.updateAnnouncementShow(
      announcementId,
      show,
    );
  }

  @Roles(Role.Admin)
  @Put('/:announcementId')
  @ApiOkResponse({
    type: UpdateAnnouncementDTO,
    description: 'Update announcement by id',
  })
  @ApiNotFoundResponse({ description: 'Announcement not found' })
  putAnnouncement(
    @Param('announcementId', ParseIntPipe) announcementId: number,
    @Body() announcementData: AnnouncementDTO,
  ) {
    return this.announcementService.updateAnnounce(
      announcementId,
      announcementData,
    );
  }
}
