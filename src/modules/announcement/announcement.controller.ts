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

import {
  // NestControllerInterface,
  // NestRequestShapes,
  // TsRest,
  TsRestHandler,
  nestControllerContract,
  tsRestHandler,
} from '@ts-rest/nest';
import { z } from 'zod';
import { initContract } from '@ts-rest/core';
import {
  AnnouncementCreateInputSchema,
  AnnouncementSchema,
} from 'src/prisma/generated/zod';

const contract = initContract();

// TODO: https://github.com/colinhacks/zod/discussions/2171

export const apiAnnouncement = contract.router({
  getAllAnnouncement: {
    method: 'GET',
    path: '/',
    responses: {
      200: z.array(AnnouncementSchema),
    },
    summary: 'Get all shown announcements',
  },
  createAnnouncement: {
    method: 'POST',
    path: '/',
    responses: {
      201: AnnouncementSchema,
    },
    body: AnnouncementCreateInputSchema,
    summary: 'Create a post',
  },
});

const c = nestControllerContract(apiAnnouncement);
// type RequestShapes = NestRequestShapes<typeof c>;

@ApiBearerAuth()
@ApiTags('announcement')
@Controller('announcement')
@UseGuards(RolesGuard)
// implements NestControllerInterface<typeof c>
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @TsRestHandler(c.getAllAnnouncement)
  @OfflineAccess(AccessState.Authenticated)
  @ApiOkResponse({
    type: AnnouncementDTO,
    isArray: true,
    description: 'Get announcements depending on user permission',
  })
  getAllAnnouncement(@User() user: UserDTO) {
    return tsRestHandler(c.getAllAnnouncement, async () => {
      const announcements =
        user?.role === Role.Admin
          ? await this.announcementService.findAll()
          : await this.announcementService.findShown();
      return { status: 200, body: announcements };
    });
  }

  @TsRestHandler(c.createAnnouncement)
  @Roles(Role.Admin)
  @Post()
  @ApiCreatedResponse({
    type: AnnouncementDTO,
    description: 'Create new announcement',
  })
  createAnnouncement() {
    return tsRestHandler(c.createAnnouncement, async ({ body }) => {
      const announcement = await this.announcementService.create(body);
      return { status: 201, body: announcement };
    });
  }

  @OfflineAccess(AccessState.Authenticated)
  @Get('/contest/:contestId')
  @ApiOkResponse({
    type: AnnouncementDTO,
    isArray: true,
    description: 'Get contest announcements',
  })
  getAllContestAnnouncement(
    @User() user: UserDTO,
    @Param('contestId', ParseIntPipe) contestId: number,
  ) {
    return user?.role === Role.Admin
      ? this.announcementService.findAllWithContestId(contestId)
      : this.announcementService.findShownWithContestId(contestId);
  }

  @Roles(Role.Admin)
  @Post('/contest/:contestId')
  @ApiCreatedResponse({
    type: AnnouncementDTO,
    description: 'Create new contest announcement',
  })
  @ApiBody({
    type: CreateAnnouncementDTO,
  })
  createContestAnnouncementInContest(
    @Body('value') value: object,
    @Param('contestId', ParseIntPipe) contestId: number,
  ) {
    return this.announcementService.create(value, contestId);
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
