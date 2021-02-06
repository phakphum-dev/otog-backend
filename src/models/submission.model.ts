import {
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Problem } from './problem.model';
import { User } from './user.model';

function strToObj(data: string) {
  return data == null ? [] : JSON.parse(data);
}

@Table({ tableName: 'result' })
export class Submission extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  timeSent: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Problem)
  @Column
  probId: number;

  @BelongsTo(() => Problem)
  problem: Problem;

  @Column({ defaultValue: 'กำลังตรวจ' })
  result: string;

  @Column({ defaultValue: 0 })
  score: number;

  @Column({ defaultValue: 0 })
  timeUsed: number;

  @Column({
    get() {
      return Boolean(this.getDataValue('isGrading'));
    },
  })
  isGrading: boolean;

  @Column({ defaultValue: null })
  errmsg: string;

  @Column({ defaultValue: null })
  contestId: number;

  @Column({ defaultValue: 'cpp' })
  language: string;
}
