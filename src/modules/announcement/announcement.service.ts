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
    return this.announcementRepository.findAll({
      order: [['id', 'DESC']],
      where: { contestId: null },
    });
  }

  async findShown() {
    return this.announcementRepository.findAll({
      where: { show: true, contestId: null },
      order: [['id', 'DESC']],
    });
  }

  async findAllWithContestId(contestId: number) {
    return this.announcementRepository.findAll({
      order: [['id', 'DESC']],
      where: { contestId },
    });
  }

  async findShownWithContestId(contestId: number) {
    return this.announcementRepository.findAll({
      where: { show: true, contestId },
      order: [['id', 'DESC']],
    });
  }

  async create(value: object, contestId: number | null = null) {
    return this.announcementRepository.create({ value, contestId });
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
