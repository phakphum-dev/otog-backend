import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UploadedFilesObject } from './dto/problem.dto';
import {
  getProblemDocDir,
  removeProblemSource,
  updateProblemDoc,
  updateProblemTestCase,
} from 'src/utils/file.util';
import { Prisma, Problem, SubmissionStatus, User } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

type ProblemNoExample = Omit<Problem, 'example'>;
type PassedCount = { passedCount: number };
type LatestSubmission = {
  latestSubmissionId: number | null;
  status: SubmissionStatus | null;
};
type ProblemWithDetail = ProblemNoExample & PassedCount & LatestSubmission;
type PassedUser = Pick<
  User,
  'id' | 'role' | 'username' | 'showName' | 'rating'
>;

export const WITHOUT_EXAMPLE = {
  id: true,
  name: true,
  sname: true,
  score: true,
  timeLimit: true,
  memoryLimit: true,
  show: true,
  recentShowTime: true,
  case: true,
  rating: true,
};

@Injectable()
export class ProblemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    problemData: Prisma.ProblemCreateInput,
    files: UploadedFilesObject,
  ) {
    try {
      const problem = await this.prisma.problem.create({
        data: {
          name: problemData.name,
          score: problemData.score,
          timeLimit: problemData.timeLimit,
          memoryLimit: problemData.memoryLimit,
          case: problemData.case,
          show: false,
        },
      });
      if (files.pdf) {
        await updateProblemDoc(`${problem.id}`, files.pdf[0].path);
      }
      if (files.zip) {
        await updateProblemTestCase(`${problem.id}`, files.zip[0].path);
      }
      return problem;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async replaceByProblemId(
    problemId: number,
    problemData: Prisma.ProblemUpdateInput,
    files: UploadedFilesObject,
  ) {
    try {
      const problem = await this.prisma.problem.update({
        data: {
          name: problemData.name,
          score: problemData.score,
          timeLimit: problemData.timeLimit,
          memoryLimit: problemData.memoryLimit,
          case: problemData.case,
        },
        where: { id: problemId },
      });
      if (files.pdf) {
        await updateProblemDoc(`${problem.id}`, files.pdf[0].path);
      }
      if (files.zip) {
        await updateProblemTestCase(`${problem.id}`, files.zip[0].path);
      }
      return problem;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOnlyShown() {
    return this.prisma.$queryRaw<Array<ProblemNoExample & PassedCount>>`
      SELECT "id", "name", "sname", "score", "timeLimit", "memoryLimit", "show", "recentShowTime", "case", "rating", COALESCE("passedCount", 0) as "passedCount" FROM (
        SELECT COUNT(*)::integer AS "passedCount", "problemId" FROM (
          SELECT "submissionId", "submission"."problemId", submission."userId" FROM (
            SELECT MAX(id) as "submissionId", "submission"."problemId", submission."userId" FROM submission GROUP BY submission."problemId", submission."userId"
          ) AS LatestIdTable JOIN submission ON submission.id = LatestIdTable."submissionId" AND submission.status = 'accept' JOIN "user" ON LatestIdTable."userId" = "user"."id" AND "user"."role" = 'user'
        ) AS CountTable GROUP BY "problemId"
      ) AS G RIGHT JOIN problem ON "problemId" = problem."id" WHERE "show" = true ORDER BY problem."id" DESC`;
  }

  async findOnlyShownWithSubmission(userId: number) {
    return this.prisma.$queryRaw<ProblemWithDetail[]>`
      SELECT "id", "name", "sname", "score", "timeLimit", "memoryLimit", "show", "recentShowTime", "case", "rating", COALESCE("passedCount", 0) as "passedCount", "latestSubmissionId", "status" FROM (
        SELECT LatestAndCountTable."problemId", "passedCount", "latestSubmissionId", "status" FROM (
          SELECT COALESCE(CountIdTable."problemId", LatestIdTable."problemId") as "problemId", "passedCount", "latestSubmissionId" FROM (
            SELECT COUNT(*)::integer AS "passedCount", "problemId" FROM (
              SELECT "submissionId", "submission"."problemId", submission."userId" FROM (
                SELECT MAX(id) as "submissionId", "submission"."problemId", submission."userId" FROM submission GROUP BY submission."problemId", submission."userId"
              ) AS LatestIdTable JOIN submission ON submission.id = LatestIdTable."submissionId" AND submission.status = 'accept' JOIN "user" ON LatestIdTable."userId" = "user"."id" AND "user"."role" = 'user'
            ) AS CountTable GROUP BY "problemId"
          ) AS CountIdTable FULL JOIN (
            SELECT MAX(id) as "latestSubmissionId", submission."problemId" FROM submission WHERE "userId" = ${userId} GROUP BY submission."problemId"
          ) AS LatestIdTable ON CountIdTable."problemId" = LatestIdTable."problemId" 
        ) AS LatestAndCountTable LEFT JOIN submission ON "latestSubmissionId" = "submission".id
      ) AS AggTable RIGHT JOIN problem ON "problemId" = problem."id" WHERE "show" = true ORDER BY problem."id" DESC`;
  }

  async findAllWithSubmission(userId: number) {
    return this.prisma.$queryRaw<ProblemWithDetail[]>`
      SELECT "id", "name", "sname", "score", "timeLimit", "memoryLimit", "show", "recentShowTime", "case", "rating", COALESCE("passedCount", 0) as "passedCount", "latestSubmissionId", "status" FROM (
        SELECT LatestAndCountTable."problemId", "passedCount", "latestSubmissionId", "status" FROM (
          SELECT COALESCE(CountIdTable."problemId", LatestIdTable."problemId") as "problemId", "passedCount", "latestSubmissionId" FROM (
            SELECT COUNT(*)::integer AS "passedCount", "problemId" FROM (
              SELECT "submissionId", "submission"."problemId", submission."userId" FROM (
                SELECT MAX(id) as "submissionId", "submission"."problemId", submission."userId" FROM submission GROUP BY submission."problemId", submission."userId"
              ) AS LatestIdTable JOIN submission ON submission.id = LatestIdTable."submissionId" AND submission.status = 'accept' JOIN "user" ON LatestIdTable."userId" = "user"."id" AND "user"."role" = 'user'
            ) AS CountTable GROUP BY "problemId"
          ) AS CountIdTable FULL JOIN (
            SELECT MAX(id) as "latestSubmissionId", submission."problemId" FROM submission WHERE "userId" = ${userId} GROUP BY submission."problemId"
          ) AS LatestIdTable ON CountIdTable."problemId" = LatestIdTable."problemId" 
        ) AS LatestAndCountTable LEFT JOIN submission ON "latestSubmissionId" = "submission".id
      ) AS AggTable RIGHT JOIN problem ON "problemId" = problem."id" ORDER BY problem."id" DESC`;
  }

  async findOneById(id: number) {
    return this.prisma.problem.findUnique({
      where: { id },
      select: WITHOUT_EXAMPLE,
    });
  }

  async findOneByIdWithExamples(id: number) {
    return this.prisma.problem.findUnique({ where: { id } });
  }

  async getProblemDocDir(problemId: number) {
    const docDir = getProblemDocDir(`${problemId}`);
    if (!docDir) throw new NotFoundException();
    return docDir;
  }

  async changeProblemShowById(problemId: number, show: boolean) {
    return this.prisma.problem.update({
      where: { id: problemId },
      data: { show, recentShowTime: new Date() },
    });
  }

  async findPassedUser(problemId: number) {
    return this.prisma.$queryRaw<PassedUser[]>`
      SELECT "id", "role", "username", "showName", "rating" FROM (
        SELECT * FROM (
          SELECT "submissionId", "status", submission."userId" FROM (
            SELECT MAX(id) as "submissionId", submission."userId" FROM submission WHERE submission."problemId" = ${problemId} GROUP BY submission."userId"
          ) AS X JOIN submission ON submission.id = "submissionId"
        ) AS T WHERE "status" = 'accept'
      ) AS S JOIN "user" ON "user"."id" = "userId" ORDER BY "user"."role"`;
  }

  async delete(problemId: number) {
    try {
      const problem = await this.prisma.problem.delete({
        where: { id: problemId },
      });
      await removeProblemSource(`${problemId}`);
      return problem;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updateProblemExamples(problemId: number, examples: object) {
    try {
      this.prisma.problem.update({
        data: { examples },
        where: { id: problemId },
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
