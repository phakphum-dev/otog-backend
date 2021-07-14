import { Sequelize } from 'sequelize-typescript';

import { SEQUELIZE, PRODUCTION } from '../constants';

import { Contest } from 'src/entities/contest.entity';
import { ContestProblem } from 'src/entities/contestProblem.entity';
import { Problem } from 'src/entities/problem.entity';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { Submission } from 'src/entities/submission.entity';
import { User } from 'src/entities/user.entity';
import { UserContest } from 'src/entities/userContest.entity';
import { Chat } from 'src/entities/chat.entity';
import { IDatabaseConfigAttributes } from './interfaces/dbConfig.interface';
import { Dialect } from 'sequelize/types';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const config: IDatabaseConfigAttributes = {
        dialect: process.env.DB_CONNECTION as Dialect,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      };
      if (process.env.NODE_ENV === PRODUCTION) {
        config.logging = false;
      }
      const sequelize = new Sequelize({
        ...config,
        define: {
          timestamps: false,
          charset: 'utf8mb4',
          collate: 'utf8mb4_bin',
        },
      });
      sequelize.addModels([
        User,
        Chat,
        Contest,
        ContestProblem,
        Problem,
        RefreshToken,
        Submission,
        UserContest,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
