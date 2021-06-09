import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

class ProblemDTOBase {
  @ApiProperty()
  readonly id: number;

  readonly name: string;

  readonly score: number;

  readonly timeLimit: number;

  readonly memoryLimit: number;

  readonly case: string;
}

export class ProblemDTO extends ProblemDTOBase {
  @ApiProperty()
  readonly sname: string;

  readonly show: boolean;

  readonly recentShowTime: Date;

  readonly rating: number;
}

export class EditProblemDTO extends ProblemDTOBase {
  readonly pdf?: File;

  readonly zip?: File;
}

export class CreateProblemDTO extends OmitType(EditProblemDTO, [
  'id',
] as const) {}

export class UploadedFilesObject {
  readonly pdf?: Express.Multer.File;

  readonly zip?: Express.Multer.File;
}

export class ToggleProblemDTO extends PickType(ProblemDTO, ['show'] as const) {}
