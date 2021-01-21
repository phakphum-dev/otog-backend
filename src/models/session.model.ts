import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

function strToObj(data:string) {
  return (data == null) ? [] : JSON.parse(data)
}

@Table({tableName: "session"})
export class Session extends Model<Session> {
  @Column({ primaryKey: true, autoIncrement: true })
  sessionId: number;

  @Column
  expires: number;

  @Column
  userId: number;

  @Column
  refreshToken: string;


}
