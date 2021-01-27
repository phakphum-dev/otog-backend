import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Contest } from '../models/contest.model';

@Injectable()
export class ContestService {
  constructor(
    @InjectModel(Contest)
    private contestModel: typeof Contest,
  ) {}

  findAll(): Promise<Contest[]> {
    return this.contestModel.findAll();
  }

  findOne(arg: any): Promise<Contest> {
    return this.contestModel.findOne({ where: arg });
  }

  currentContest(): Promise<Contest> {
    return this.contestModel.findOne({
      where: {
        timeEnd: {
          [Op.gte]: Math.floor(Date.now() / 1000) - 3600,
        },
      },
    });
  }
}
