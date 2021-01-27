import { fstat } from 'fs';

import * as fs from 'fs';
export const jwtConstants = {
  private: fs.readFileSync('./private.key', 'utf8'),
  public: fs.readFileSync('./public.key', 'utf8'),
};
