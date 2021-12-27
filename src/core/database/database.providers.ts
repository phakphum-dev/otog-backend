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
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfigAttributes } from './interfaces/dbConfig.interface';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get<IDatabaseConfigAttributes>('db'),
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
