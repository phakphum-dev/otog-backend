import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

function strToObj(data: string) {
  return data == null ? [] : JSON.parse(data);
}

@Table({ tableName: 'contest' })
export class Contest extends Model<Contest> {
  @Column({ primaryKey: true, autoIncrement: true })
  contestId: number;

  @Column
  name: string;

  @Column({ unique: true })
  contestMode: string;

  @Column
  gradingMode: string;

  @Column
  timeStart: number;

  @Column
  timeEnd: number;

  @Column({ 
    defaultValue: '[]',
    get() {return strToObj(this.getDataValue('problems'))} })
  problems: string;

  @Column({
    defaultValue: null,
    get() {return strToObj(this.getDataValue('announce'))} })
  announce: string;
}
