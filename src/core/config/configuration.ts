import { PRODUCTION } from '../constants';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET,
  offlineMode: process.env.OFFLINE_MODE === 'true',
  jwtOption: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '5m',
    },
  },
  db: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: process.env.NODE_ENV === PRODUCTION ? false : true,
  },
});
