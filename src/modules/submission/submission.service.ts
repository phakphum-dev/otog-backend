import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Role, Status, SUBMISSION_REPOSITORY } from 'src/core/constants';
import {
  scodeFileFilter,
  scodeFileSizeFilter,
} from 'src/utils/fileUpload.utils';
import { Submission } from '../../entities/submission.entity';
import { UserDTO } from '../user/dto/user.dto';
import { UploadFileDTO } from './dto/submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private submissionRepository: typeof Submission,
  ) {}

  findAllWithOutContest(offset: number, limit: number): Promise<Submission[]> {
    return this.submissionRepository.scope('full').findAll({
      where: {
        contestId: null,
        id: {
          [Op.lt]: offset || 1e9,
        },
      },
      limit: limit || 89,
    });
  }

  findAllWithOutContestAndAdmin(
    offset: number,
    limit: number,
  ): Promise<Submission[]> {
    return this.submissionRepository.scope('full').findAll({
      where: {
        contestId: null,
        id: {
          [Op.lt]: offset || 1e9,
        },
        '$user.role$': {
          [Op.not]: Role.Admin,
        },
      },
      limit: limit || 89,
    });
  }

  findAllWithContest(offset: number, limit: number): Promise<Submission[]> {
    return this.submissionRepository.scope('full').findAll({
      where: {
        contestId: {
          [Op.not]: null,
        },
        id: {
          [Op.lt]: offset || 1e9,
        },
      },
      limit: limit || 89,
    });
  }

  async findOneByResultId(resultId: number) {
    return await this.submissionRepository.scope('full').findOne({
      where: { id: resultId },
      attributes: {
        include: ['sourceCode'],
      },
    });
  }

  fileCheck(file: Express.Multer.File) {
    // check file extension
    if (!scodeFileFilter(file))
      throw new BadRequestException('Only C C++ and Python are allowed!');
    // check file size
    if (!scodeFileSizeFilter(file))
      throw new BadRequestException('File is too large!');
  }

  async create(
    user: UserDTO,
    problemId: number,
    data: UploadFileDTO,
    file: Express.Multer.File,
  ) {
    this.fileCheck(file);
    try {
      const submission = new Submission();
      submission.userId = user?.id;
      submission.problemId = problemId;
      submission.language = data.language;
      submission.status = Status.Waiting;
      submission.contestId = Number(data.contestId) || null;
      submission.sourceCode = file.buffer.toString();
      await submission.save();
    } catch {
      throw new BadRequestException();
    }
    return { msg: 'create submission complete.' };
  }

  findAllByUserIdWithOutContest(
    userId: number,
    offset: number,
    limit: number,
  ): Promise<Submission[]> {
    return this.submissionRepository.scope('full').findAll({
      where: {
        contestId: null,
        userId,
        id: {
          [Op.lt]: offset || 1e9,
        },
      },
      limit: limit || 89,
    });
  }

  findOneByUserId(userId: number): Promise<Submission> {
    return this.submissionRepository.scope('full').findOne({
      where: { userId },
      attributes: {
        include: ['sourceCode'],
      },
    });
  }

  findOneByProblemIdAndUserId(
    problemId: number,
    userId: number,
  ): Promise<Submission> {
    return this.submissionRepository.scope('full').findOne({
      where: { userId, problemId },
      attributes: {
        include: ['sourceCode'],
      },
    });
  }
}
