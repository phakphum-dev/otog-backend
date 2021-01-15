import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Submission } from './submission.model';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectModel(Submission)
        private submissionModel: typeof Submission
    ) {}

    findAll(): Promise<Submission[]> {
        return this.submissionModel.findAll({
            limit: 1000,
            order: [
                ['idResult', 'DESC']
            ]
        })
    }

    findOne(arg: any): Promise<Submission> {
        return this.submissionModel.findOne({ where: arg})
    }

    findAllByIdUser(idUser: number): Promise<Submission[]> {
        return this.submissionModel.findAll({
            where : {idUser},
            order: [
                ['idResult', 'DESC']
            ]
        })
    }
}
