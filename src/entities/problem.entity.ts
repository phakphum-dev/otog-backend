import {
  AutoIncrement,
  Column,
  DefaultScope,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Submission } from './submission.entity';
import { User } from './user.entity';

@DefaultScope(() => ({
  order: [['id', 'DESC']],
}))
@Table({ tableName: 'problem' })
export class Problem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  sname: string;

  @Column
  score: number;

  @Column
  timeLimit: number;

  @Column
  memoryLimit: number;

  @Column({
    allowNull: false,
  })
  show: boolean;

  @Column
  recentShowTime: Date;

  @Column
  case: string;

  @Column
  rating: number;

  @HasOne(() => Submission)
  submission: Submission;
}
