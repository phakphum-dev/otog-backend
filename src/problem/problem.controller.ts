import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { ProblemService } from './problem.service';

@Controller('problem')
export class ProblemController {
    constructor(private problemService: ProblemService) {}

    @Get()
    getAllProblems() {
        return this.problemService.findAll()
    }

    @Get('/:idProb')
    getProblemById(@Param('idProb') idProb: number) {
        return this.problemService.finOne({idProb})
    }

    @Get('doc/:idProb')
    async getDocById(@Param('idProb') idProb: number, @Res() res: Response) {
        const prob = await this.problemService.finOne({idProb})
        res.sendFile(`${process.cwd()}/docs/${prob.sname}.pdf`)
    }
}
