import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { strToObj } from '../utils/convert.utils';
import { ContestProblem } from './contestProblem.entity';
import { Problem } from './problem.entity';
import { User } from './user.entity';
import { UserContest } from './userContest.entity';
import { ContestMode, GradingMode } from '../core/constants';

@Scopes(() => ({
  full: {
    include: [
      {
        model: Problem,
        through: {
          attributes: [],
        },
      },
    ],
  },
}))
@Table({ tableName: 'contest' })
export class Contest extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column({
    type: DataType.ENUM,
    values: ['rated', 'unrated'],
    allowNull: false,
  })
  mode: ContestMode;

  @Column({
    type: DataType.ENUM,
    values: ['acm', 'classic'],
    allowNull: false,
  })
  gradingMode: GradingMode;

  @Column
  timeStart: Date;

  @Column
  timeEnd: Date;

  @Column({
    get() {
      return strToObj(this.getDataValue('announce'));
    },
  })
  announce: string;

  @BelongsToMany(() => Problem, () => ContestProblem)
  problems: Problem[];

  @BelongsToMany(() => User, () => UserContest)
  users: User[];
}
