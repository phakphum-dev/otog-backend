import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

function strToObj(data: string) {
  return data == null ? [] : JSON.parse(data);
}

@Table({ tableName: 'problem' })
export class Problem extends Model<Problem> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column({ unique: true })
  sname: string;

  @Column
  score: number;

  @Column
  timeLimit: number;

  @Column
  memory: number;

  @Column({ defaultValue: 0 })
  state: number;

  @Column({ defaultValue: 0 })
  recentShowTime: number;

  @Column({ defaultValue: null })
  case: string;

  @Column({ defaultValue: null })
  rating: number;
}
