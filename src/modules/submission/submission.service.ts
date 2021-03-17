import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Op } from 'sequelize';
import { SUBMISSION_REPOSITORY } from 'src/core/constants';
import { Submission } from '../../entities/submission.entity';

const fileExt = {
  c: '.c',
  cpp: '.cpp',
};

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(SUBMISSION_REPOSITORY)
    private submissionRepository: typeof Submission,
  ) {}

  findAllWithOutContest(): Promise<Submission[]> {
    return this.submissionRepository.findAll({
      where: {
        contestId: null,
      },
      limit: 100,
    });
  }

  findAllWithContest(): Promise<Submission[]> {
    return this.submissionRepository.findAll({
      where: {
        contestId: {
          [Op.not]: null,
        },
      },
      limit: 100,
    });
  }

  async findOneByResultId(resultId: number) {
    return await this.submissionRepository.findOne({
      where: { id: resultId },
    });
  }

  async readLatestSourceCode(
    problemId: number,
    userId: number,
    language: string,
  ) {
    const filename = `${problemId}${fileExt[language]}`;
    const dir = `./upload/${userId}`;
    let sourceCode: string;
    try {
      sourceCode = await readFileSync(`${dir}/${filename}`).toString();
    } catch {
      sourceCode = `ENOENT: no such file or directory.`;
    }
    return sourceCode;
  }

  async create(data: any) {
    const submission = new Submission();
    submission.userId = Number(data.userId);
    submission.problemId = Number(data.problemId);
    submission.language = data.language;
    submission.contestId = Number(data?.contestId) || null;
    submission.sourceCode = await this.readLatestSourceCode(
      Number(data.problemId),
      Number(data.userId),
      data.language,
    );
    const result = await submission.save();
    return { result, status: true };
  }

  findAllByUserId(userId: number): Promise<Submission[]> {
    return this.submissionRepository.findAll({
      where: { userId },
    });
  }

  findOneByUserId(userId: number): Promise<Submission> {
    return this.submissionRepository.findOne({
      where: { userId },
    });
  }
}
