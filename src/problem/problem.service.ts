import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Problem } from './problem.model';

@Injectable()
export class ProblemService {
    constructor(
        @InjectModel(Problem)
        private problemModel: typeof Problem
    ) {}

    findAll(): Promise<Problem[]> {
        return this.problemModel.findAll()
    }

    finOne(arg: any): Promise<Problem> {
        return this.problemModel.findOne({ where: arg})
    }

}
