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

export function scodeFileSizeFilter(file: Express.Multer.File) {
  if (file.size > 10 * 1024) {
    return false;
  }
  return true;
}

export const editFileName = (req, file, callback) => {
  const data = req.body;
  const problemId = req.params?.problemId;
  const fileExtName = fileExt[data.language];
  callback(null, `${problemId}${fileExtName}`);
};

export const editDestPath = (req, file, callback) => {
  createUploadFolder();
  const user = req.user;
  const dir = `upload/${user.id}`;
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  callback(null, dir);
};

const createUploadFolder = () => {
  const dir = `upload`;
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};
