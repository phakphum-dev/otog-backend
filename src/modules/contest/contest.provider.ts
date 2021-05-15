import {
  CONTESTPROBLEM_REPOSITORY,
  CONTEST_REPOSITORY,
  USERCONTEST_REPOSITORY,
} from 'src/core/constants';
import { Contest } from 'src/entities/contest.entity';
import { ContestProblem } from 'src/entities/contestProblem.entity';
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
];
