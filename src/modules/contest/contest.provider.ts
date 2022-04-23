import {
  CONTESTPROBLEM_REPOSITORY,
  CONTEST_REPOSITORY,
  SUBMISSION_REPOSITORY,
  USERCONTEST_REPOSITORY,
} from 'src/core/constants';
import { Contest } from 'src/entities/contest.entity';
import { ContestProblem } from 'src/entities/contestProblem.entity';
import { Submission } from 'src/entities/submission.entity';
import { UserContest } from 'src/entities/userContest.entity';

export const contestProvider = [
  {
    provide: CONTEST_REPOSITORY,
    useValue: Contest,
  },
  {
    provide: CONTESTPROBLEM_REPOSITORY,
    useValue: ContestProblem,
  },
  {
    provide: USERCONTEST_REPOSITORY,
    useValue: UserContest,
  },
  {
    provide: SUBMISSION_REPOSITORY,
    useValue: Submission,
  },
];
