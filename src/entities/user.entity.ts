import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  IsEmail,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { Submission } from './submission.entity';
import { UserContest } from './userContest.entity';

@Scopes(() => ({
  noPass: {
    attributes: {
      exclude: ['password', 'email'],
    },
  },
}))
@Table({ tableName: 'user' })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  username: string;

  @Unique
  @Column
  showName: string;

  @Unique
  @IsEmail
  @Column
  email: string;

  @Column
  password: string;

  @Column({
    type: DataType.ENUM,
    values: ['user', 'admin'],
    allowNull: false,
  })
  role: string;

  @Column
  rating: number;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updateDate: Date;

  @BelongsToMany(() => Problem, () => Submission)
  problems: Problem[];

  @BelongsToMany(() => Contest, () => UserContest)
  attendedContest: UserContest[];
}
