import { ANNOUNCEMENT_REPOSITORY } from 'src/core/constants';
import { Announcement } from 'src/entities/announcement.entity';

export const announcementProvider = [
  {
    provide: ANNOUNCEMENT_REPOSITORY,
    useValue: Announcement,
  },
];
