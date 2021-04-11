import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { ContestDTO } from 'src/modules/contest/dto/contest.dto';
import { SubmissionForScoreboardDTO } from 'src/modules/submission/dto/submission.dto';

export class UserDTO {
  @ApiProperty()
  id: number;

  username: string;

  showName: string;

  role: string;

  rating: number;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.showName = user.showName;
    this.role = user.role;
    this.rating = user.rating;
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
