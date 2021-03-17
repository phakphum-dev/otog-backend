import {
  Column,
  CreatedAt,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ tableName: 'refreshToken' })
export class RefreshToken extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  userId: number;

  @Column
  jwtId: string;

  @Column({ defaultValue: false })
  used: boolean;

  @Column
  expiryDate: Date;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updateDate: Date;
}
