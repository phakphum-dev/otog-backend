import { existsSync, mkdir, mkdirSync } from 'fs';

const fileExt = {
  C: '.c',
  'C++': '.cpp',
};

export const scodeFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(c|cpp|py)$/)) {
    return callback(new Error('Only C C++ and Python are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const data = req.body;
  const timeSent = Math.floor(Date.now() / 1000);
  const fileExtName = fileExt[data.language];
  callback(null, `${data.probId}_${timeSent}${fileExtName}`);
};

export const editDestPath = (req, file, callback) => {
  const data = req.body;
  const dir = `upload/${data.userId}`;
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  callback(null, dir);
};
