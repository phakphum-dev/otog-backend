import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

function strToObj(data:string) {
  return (data == null) ? [] : JSON.parse(data)
}

@Table({tableName: "result"})
export class Submission extends Model<Submission> {
  @Column({ primaryKey: true, autoIncrement: true })
  idResult: number;

  @Column
  time: number;

  @Column
  idUser: number;

  @Column
  idProb: number;

  @Column({ defaultValue: 'กำลังตรวจ'})
  result: string;

  @Column({ defaultValue: 0})
  score: number;

  @Column({ defaultValue: 0})
  timeuse: number;

  @Column
  status: number

  @Column({ defaultValue: null})
  errmsg: string

  @Column({ defaultValue: null})
  idContest: number

  @Column({ defaultValue: 'C++'})
  language: string
}
