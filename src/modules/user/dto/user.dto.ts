import { ApiProperty, PickType } from '@nestjs/swagger';
import { Role } from 'src/core/constants';
import { SubmissionForScoreboardDTO } from 'src/modules/submission/dto/submission.dto';

export class UserDTO {
  @ApiProperty()
  id: number;

  username: string;

  showName: string;

  @ApiProperty({ enum: Role })
  role: Role;

  rating: number;

  constructor(user: any) {
    this.id = user?.id;
    this.username = user?.username;
    this.showName = user?.showName;
    this.role = user?.role;
    this.rating = user?.rating;
  }
}

export class UserForScoreboardDTO extends UserDTO {
  submissions: SubmissionForScoreboardDTO[];
}

export class UserProfileDTO extends UserDTO {
  attendedContest: AttendedContestDTO[];
}

export class AttendedContestDTO {
  id: number;
  name: string;
  timeEnd: Date;
  detail: {
    rank: number;
    ratingAfterUpdate: number;
  };
}

export class PatchShowNameDTO extends PickType(UserDTO, [
  'showName' as const,
]) {}
