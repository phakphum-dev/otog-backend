import { IDatabaseConfig } from './interfaces/dbConfig.interface';

export const databaseConfig: IDatabaseConfig = {
  development: {
    dialect: 'mysql',
    host: 'db',
    port: 8888,
    username: 'root',
    password: '0000',
    database: 'otog',
  },
  production: {
    dialect: 'mysql',
    host: 'db',
    port: 8888,
    username: 'root',
    password: '0000',
    database: 'otog',
  },
};
