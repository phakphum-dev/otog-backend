import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

function strToObj(data: string) {
  return data == null ? [] : JSON.parse(data);
}

@Table({ tableName: 'user' })
export class User extends Model<User> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column
  password: string;

  @Column
  showName: string;

  @Column({ defaultValue: 1 })
  state: number;

  @Column({ defaultValue: 0 })
  rating: number;

  @Column({
    defaultValue: null,
    get() {
      return strToObj(this.getDataValue('history'));
    },
  })
  history: string;
}
