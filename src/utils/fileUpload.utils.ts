import { existsSync, mkdirSync } from 'fs';

const fileExt = {
  c: '.c',
  cpp: '.cpp',
};

export const scodeFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(c|cpp|py)$/)) {
    return callback(new Error('Only C C++ and Python are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const data = req.body;
  const fileExtName = fileExt[data.language];
  callback(null, `${data.probId}${fileExtName}`);
};

export const editDestPath = (req, file, callback) => {
  const data = req.body;
  const dir = `upload/${data.userId}`;
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  callback(null, dir);
};
