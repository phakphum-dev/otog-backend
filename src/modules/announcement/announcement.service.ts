import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ANNOUNCEMENT_REPOSITORY } from 'src/core/constants';
import { Announcement } from 'src/entities/announcement.entity';
import { AnnouncementDTO } from './dto/announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    @Inject(ANNOUNCEMENT_REPOSITORY)
    private announcementRepository: typeof Announcement,
  ) {}

  async findOneById(announcementId: number) {
    try {
      return await this.announcementRepository.findOne({
        where: { id: announcementId },
        rejectOnEmpty: true,
      });
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async findAll() {
    return this.announcementRepository.findAll({ order: ['id'] });
  }

  async findShown() {
    return this.announcementRepository.findAll({
      where: { show: true },
      order: [['id', 'ASC']],
    });
  }

  async create(value: object) {
    return this.announcementRepository.create({ value });
  }

  async delete(announcementId: number) {
    const announcement = await this.findOneById(announcementId);
    await announcement.destroy();
    return announcement;
  }

  async updateAnnouncementShow(announcementId: number, show: boolean) {
    const announcement = await this.findOneById(announcementId);
    return announcement.update({ show });
  }

  async updateAnnounce(
    announcementId: number,
    announcementData: AnnouncementDTO,
  ) {
    const announcement = await this.findOneById(announcementId);
    return announcement.update(announcementData);
  }
}
