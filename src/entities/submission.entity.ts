import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
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
    exclude: ['userId', 'problemId', 'sourceCode', 'updateDate'],
  },
  order: [['id', 'DESC']],
  include: [User.scope('noPass'), Problem],
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
  @Column({ defaultValue: true })
  isGrading: boolean;

  @Column({
    type: DataType.TEXT({ length: 'long' }),
    get() {
      return this.getDataValue('result') === 'Compilation Error'
        ? this.getDataValue('errmsg')
        : null;
    },
  })
  errmsg: string;

  @Column
  contestId: number;

  @Column({
    type: DataType.TEXT,
  })
  sourceCode: string;

  @Column
  language: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updateDate: Date;
}
