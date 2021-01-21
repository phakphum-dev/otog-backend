import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { readFileSync } from 'fs';
import { Op } from 'sequelize';
import { Submission } from '../models/submission.model';

const fileExt = {
  C: '.c',
  'C++': '.cpp',
};

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission)
    private submissionModel: typeof Submission,
  ) {}

  findAll(): Promise<Submission[]> {
    return this.submissionModel.findAll({
      where: {
        contestId: null
      },
      limit: 1000,
      order: [['resultId', 'DESC']],
    });
  }

  findAllWithContest(): Promise<Submission[]> {
    return this.submissionModel.findAll({
      where: {
        contestId: {
          [Op.not]: null,
        },
      },
      limit: 1000,
      order: [['resultId', 'DESC']],
    });
  }

  findOne(arg: any): Promise<Submission> {
    return this.submissionModel.findOne({ where: arg });
  }

  async findOneByResultId(resultId: number) {
    let resultData = await this.submissionModel.findOne({
      where: { resultId },
    });
    const filename = `${resultData.probId}_${resultData.time}${
      fileExt[resultData.language]
    }`;
    const dir = `./upload/${resultData.userId}`;
    const scode = readFileSync(`${dir}/${filename}`).toString();
    const result = {
      resultId: resultData.resultId,
      time: resultData.time,
      userId: resultData.userId,
      probId: resultData.probId,
      result: resultData.result,
      score: resultData.score,
      timeuse: resultData.timeuse,
      status: resultData.status,
      errmsg: resultData.errmsg,
      contestId: resultData.contestId,
      language: resultData.language,
      scode: scode,
    };
    return result;
  }

  async create(data: any, time: number) {
    const result = new Submission();
    result.time = time;
    result.userId = Number(data.userId);
    result.probId = Number(data.probId);
    result.status = 0;
    result.language = data.lang;
    result.contestId = Number(data?.contestId) || null;
    const resultData = await result.save();
    return { resultData, status: true };
  }

  findAllByUserId(userId: number): Promise<Submission[]> {
    return this.submissionModel.findAll({
      where: { userId },
      order: [['resultId', 'DESC']],
    });
  }
}
