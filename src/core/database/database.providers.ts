import { Sequelize } from 'sequelize-typescript';

import { SEQUELIZE, DEVELOPMENT, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';

import { Contest } from 'src/entities/contest.entity';
import { ContestProblem } from 'src/entities/contestProblem.entity';
import { Problem } from 'src/entities/problem.entity';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { Submission } from 'src/entities/submission.entity';
import { User } from 'src/entities/user.entity';
import { UserContest } from 'src/entities/userContest.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize({
        ...config,
        define: { timestamps: false },
      });
      sequelize.addModels([
        Contest,
        ContestProblem,
        Problem,
        RefreshToken,
        User,
        Submission,
        UserContest,
      ]);
      // await sequelize.sync();
      return sequelize;
    },
  },
];
