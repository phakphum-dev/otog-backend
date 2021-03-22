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
  const problemId = req.params?.problemId;
  const fileExtName = fileExt[data.language];
  callback(null, `${problemId}${fileExtName}`);
};

export const editDestPath = (req, file, callback) => {
  const user = req.user;
  const dir = `upload/${user.id}`;
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  callback(null, dir);
};
