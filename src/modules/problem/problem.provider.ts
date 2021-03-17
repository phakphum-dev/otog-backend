import { PROBLEM_REPOSITORY } from 'src/core/constants';
import { Problem } from 'src/entities/problem.entity';

export const problemProvider = [
  {
    provide: PROBLEM_REPOSITORY,
    useValue: Problem,
  },
];
