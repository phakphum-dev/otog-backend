import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Col } from 'sequelize/types/lib/utils';

function strToObj(data: string) {
  return data == null ? [] : JSON.parse(data);
}

@Table({ tableName: 'session' })
export class Session extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  userId: number;

  @Column
  refreshToken: string;

  @Column
  loginTime: number;

  @Column
  expiresTime: number;
}
