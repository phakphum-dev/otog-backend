import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { readFileSync } from 'fs';
import { Submission } from './submission.model';

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
      limit: 1000,
      order: [['idResult', 'DESC']],
    });
  }

  findOne(arg: any): Promise<Submission> {
    return this.submissionModel.findOne({ where: arg });
  }

  async findOneByIdResult(idResult: number) {
    let resultData = await this.submissionModel.findOne({
      where: { idResult },
    });
    const filename = `${resultData.idProb}_${resultData.time}${
      fileExt[resultData.language]
    }`;
    const dir = `./upload/${resultData.idUser}`;
    const scode = readFileSync(`${dir}/${filename}`).toString();
    const result = {
      idResult: resultData.idResult,
      time: resultData.time,
      idUser: resultData.idUser,
      idProb: resultData.idProb,
      result: resultData.result,
      score: resultData.score,
      timeuse: resultData.timeuse,
      status: resultData.status,
      errmsg: resultData.errmsg,
      idContest: resultData.idContest,
      language: resultData.language,
      scode: scode
    };
    return result;
  }

  async create(data: any, time: number) {
    const result = new Submission();
    result.time = time;
    result.idUser = data.idUser;
    result.idProb = data.idProb;
    result.status = 0;
    result.language = data.lang;
    const resultData = await result.save();
    return { resultData, status: true };
  }

  findAllByIdUser(idUser: number): Promise<Submission[]> {
    return this.submissionModel.findAll({
      where: { idUser },
      order: [['idResult', 'DESC']],
    });
  }
}
