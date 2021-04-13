import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Contest } from './contest.entity';
import { User } from './user.entity';
@Table({ tableName: 'userContest' })
export class UserContest extends Model {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  userId: number;

  @PrimaryKey
  @ForeignKey(() => Contest)
  @Column
  contestId: number;

  @Column
  rank: number;

  @Column
  ratingAfterUpdate: number;
}
