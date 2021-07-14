import { Dialect } from 'sequelize/types';

export interface IDatabaseConfigAttributes {
  dialect?: Dialect;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  logging?: boolean;
}
