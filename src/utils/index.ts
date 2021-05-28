import { existsSync, mkdirSync } from 'fs';

const fileExt = {
  c: '.c',
  cpp: '.cpp',
};

export function scodeFileFilter(file: Express.Multer.File) {
  if (!file.originalname.match(/\.(c|cpp|py)$/)) {
    return false;
  }
  return true;
}

export function scodeFileSizeLimit(
  file: Express.Multer.File,
  limitSize: number,
) {
  if (file.size > limitSize) {
    return false;
  }
  return true;
}

export const strToObj = (data: string) => {
  return data == null ? [] : JSON.parse(data);
};
