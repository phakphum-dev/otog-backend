import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Op, literal } from 'sequelize';
import { Role, Status, SUBMISSION_REPOSITORY } from 'src/core/constants';
import { scodeFileFilter, scodeFileSizeLimit } from 'src/utils';
import { Submission } from '../../entities/submission.entity';
import { User } from '../../entities/user.entity';
import { UserDTO } from '../user/dto/user.dto';
import { UploadFileDTO } from './dto/submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private submissionRepository: typeof Submission,
  ) {}

  findAll(offset: number, limit: number): Promise<Submission[]> {
    return this.submissionRepository.scope('full').findAll({
      where: {
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
    if (!scodeFileSizeLimit(file, 10 * 1024))
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

  findAllLatestAccept() {
    return this.submissionRepository.findAll({
      attributes: {
        include: ['userId', 'problemId'],
      },
      include: [
        {
          model: User,
          attributes: ['role'],
        },
      ],
      where: {
        id: {
          [Op.in]: [
            literal(
              `SELECT MAX(id) FROM submission WHERE status = 'accept' GROUP BY problemId,userId`,
            ),
          ],
        },
        '$user.role$': {
          [Op.not]: Role.Admin,
        },
      },
      order: ['problemId'],
      raw: true,
      nest: true,
    });
  }
}
