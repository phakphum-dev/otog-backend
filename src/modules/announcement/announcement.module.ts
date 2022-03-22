import { Module } from '@nestjs/common';
import { announcementProvider } from './announcement.provider';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';

@Module({
  providers: [AnnouncementService, ...announcementProvider],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
