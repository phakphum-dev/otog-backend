import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
@Table({ tableName: 'contestProblem' })
export class ContestProblem extends Model {
  @PrimaryKey
  @ForeignKey(() => Contest)
  @Column
  contestId: number;

  @PrimaryKey
  @ForeignKey(() => Problem)
  @Column
  problemId: number;
}
