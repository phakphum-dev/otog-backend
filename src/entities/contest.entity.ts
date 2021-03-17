import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DefaultScope,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { strToObj } from '../utils/convert.utils';
import { ContestProblem } from './contestProblem.entity';
import { Problem } from './problem.entity';
import { User } from './user.entity';
import { UserContest } from './userContest.entity';

@DefaultScope(() => ({
  include: [Problem],
}))
@Table({ tableName: 'contest' })
export class Contest extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  contestMode: string;

  @Column
  gradingMode: string;

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
