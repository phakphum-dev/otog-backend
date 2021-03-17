import { CONTEST_REPOSITORY } from 'src/core/constants';
import { Contest } from 'src/entities/contest.entity';

export const contestProvider = [
  {
    provide: CONTEST_REPOSITORY,
    useValue: Contest,
  },
];
