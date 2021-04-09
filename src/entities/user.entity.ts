import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
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
      exclude: ['password', 'email', 'creationDate', 'updateDate'],
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
  @Column({
    allowNull: false,
  })
  username: string;

  @Unique
  @Column({
    allowNull: false,
  })
  showName: string;

  @Unique
  @IsEmail
  @Column
  email: string;

  @Column({
    allowNull: false,
  })
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

  @BelongsToMany(() => Contest, () => UserContest)
  attendedContest: UserContest[];

  @HasMany(() => Submission)
  submissions: Submission[];
}
