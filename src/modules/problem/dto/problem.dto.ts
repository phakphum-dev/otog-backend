import { ApiProperty } from '@nestjs/swagger';

export class ProblemDTO {
  @ApiProperty()
  readonly id: number;

  readonly name: string;

  readonly sname: string;

  readonly score: number;

  readonly timeLimit: number;

  readonly memoryLimit: number;

  readonly show: boolean;

  readonly recentShowTime: Date;

  readonly case: string;

  readonly rating: number;
}

export class CreateProblemDTO {
  @ApiProperty()
  readonly name: string;

  readonly score: number;

  readonly timeLimit: number;

  readonly memoryLimit: number;

  readonly case: string;

  readonly pdf?: File;

  readonly zip?: File;
}

export class ReplaceProblemDTO {
  @ApiProperty()
  readonly id: number;

  readonly name: string;

  readonly score: number;

  readonly timeLimit: number;

  readonly memoryLimit: number;

  readonly case: string;

  readonly pdf?: File;

  readonly zip?: File;
}

export class UploadedFilesObject {
  readonly pdf?: Express.Multer.File;

  readonly zip?: Express.Multer.File;
}
