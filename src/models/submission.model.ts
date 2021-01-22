import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

function strToObj(data: string) {
  return data == null ? [] : JSON.parse(data);
}

@Table({ tableName: 'result' })
export class Submission extends Model<Submission> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  timeSent: number;

  @Column
  userId: number;

  @Column
  probId: number;

  @Column({ defaultValue: 'กำลังตรวจ' })
  result: string;

  @Column({ defaultValue: 0 })
  score: number;

  @Column({ defaultValue: 0 })
  timeUsed: number;

  @Column({
    get() {
      return Boolean(this.getDataValue('isGrading'));
    },
  })
  isGrading: boolean;

  @Column({ defaultValue: null })
  errmsg: string;

  @Column({ defaultValue: null })
  contestId: number;

  @Column({ defaultValue: 'C++' })
  language: string;
}
