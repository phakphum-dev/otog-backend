import { SUBMISSION_REPOSITORY } from 'src/core/constants';
import { Submission } from 'src/entities/submission.entity';

export const submissionProvider = [
  {
    provide: SUBMISSION_REPOSITORY,
    useValue: Submission,
  },
];
