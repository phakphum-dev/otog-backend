import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Problem } from './problem.entity';
import { User } from './user.entity';

@DefaultScope(() => ({
  attributes: {
    exclude: ['userId', 'probId'],
  },
  order: [['id', 'DESC']],
  include: [Problem, User],
}))
@Table({ tableName: 'submission' })
export class Submission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Problem)
  @Column
  problemId: number;

  @BelongsTo(() => Problem)
  problem: Problem;

  @BelongsTo(() => User)
  user: User;

  @Column({ defaultValue: 'WAITING' })
  result: string;

  @Column
  score: number;

  @Column
  timeUsed: number;

  // @Column({
  //   get() {
  //     return Boolean(this.getDataValue('isGrading'));
  //   },
  // })
  @Column({ defaultValue: false })
  isGrading: boolean;

  @Column
  errmsg: string;

  @Column
  contestId: number;

  @Column
  sourceCode: string;

  @Column
  language: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updateDate: Date;
}
