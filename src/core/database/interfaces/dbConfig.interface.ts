export interface IDatabaseConfigAttributes {
  dialect?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  database?: string;
  logging?: boolean;
}

export interface IDatabaseConfig {
  development: IDatabaseConfigAttributes;
  production: IDatabaseConfigAttributes;
}
