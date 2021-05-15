import * as fs from 'fs';

export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const USERCONTEST_REPOSITORY = 'USERCONTEST_REPOSITORY';
export const PROBLEM_REPOSITORY = 'PROBLEM_REPOSITORY';
export const REFRESHTOKEN_REPOSITORY = 'REFRESHTOKEN_REPOSITORY';
export const CONTEST_REPOSITORY = 'CONTEST_REPOSITORY';
export const CONTESTPROBLEM_REPOSITORY = 'CONTESTPROBLEM_REPOSITORY';
export const SUBMISSION_REPOSITORY = 'SUBMISSION_REPOSITORY';
export const JWT_PRIVATE = fs.readFileSync('./private.key', 'utf8');
export const JWT_PUBLIC = fs.readFileSync('./public.key', 'utf8');
export const ROLES_KEY = 'roles';
export const IS_PUBLIC_KEY = 'isPublic';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum Status {
  Waiting = 'waiting',
  Grading = 'grading',
  Accept = 'accept',
  Reject = 'reject',
}

export enum GradingMode {
  ACM = 'acm',
  Classic = 'classic',
}

export enum ContestMode {
  Rated = 'rated',
  Unrated = 'unrated',
}
