import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Scopes(() => ({
  full: {
    attributes: {
      exclude: ['userId', 'updateDate'],
    },
    order: [['id', 'DESC']],
    include: [User.scope('noPass')],
  },
}))
@Table({ tableName: 'chat' })
export class Chat extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false })
  message: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updateDate: Date;
}
