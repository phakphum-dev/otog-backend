import * as fs from 'fs-extra';
import * as path from 'path';
import { DOC_DIR, TESTCASE_DIR } from 'src/core/constants';
import * as unzipper from 'unzipper';
import * as mv from 'mv';
import { promisify } from 'util';

const mvPromise = promisify(mv);

interface IUpdateProblemOption {
  override: boolean;
}

async function createDirIfNotExist(path: string) {
  if (!(await fs.pathExists(path))) {
    await fs.mkdir(path);
  }
}

async function removeDirIfExist(path: string) {
  if (await fs.pathExists(path)) {
    await fs.remove(path);
  }
}

export async function updateProblemDoc(
  problemName: string,
  oldPath: string,
  option?: IUpdateProblemOption,
) {
  const { override = true } = option || {};
  await createDirIfNotExist(DOC_DIR);

  const uploadDocPath = path.join(DOC_DIR, `${problemName}.pdf`);

  if (override) {
    await removeDirIfExist(uploadDocPath);
  }

  // move pdf file to source folder
  await mvPromise(oldPath, uploadDocPath);
}

export async function updateProblemTestCase(
  problemName: string,
  oldPath: string,
  option?: IUpdateProblemOption,
) {
  const { override = true } = option || {};
  await createDirIfNotExist(TESTCASE_DIR);

  const problemTestCaseDir = path.join(TESTCASE_DIR, problemName);

  if (override) {
    await removeDirIfExist(problemTestCaseDir);
  }

  await createDirIfNotExist(problemTestCaseDir);

  const uploadTestCasePath = path.join(
    problemTestCaseDir,
    `${problemName}.zip`,
  );

  // move zip file to source folder
  await mvPromise(oldPath, uploadTestCasePath);
  // unzip source file
  const fileContents = fs.createReadStream(uploadTestCasePath);
  fileContents.pipe(unzipper.Extract({ path: problemTestCaseDir }));
  await removeDirIfExist(uploadTestCasePath);
}

export async function removeProblemSource(problemName: string) {
  const docPath = path.join(DOC_DIR, `${problemName}.pdf`);
  const testCasePath = path.join(TESTCASE_DIR, problemName);

  await removeDirIfExist(docPath);
  await removeDirIfExist(testCasePath);
}

export function getProblemDocDir(problemName: string) {
  const docDir = path.join(DOC_DIR, `${problemName}.pdf`);
  if (!fs.existsSync(docDir)) return null;
  return docDir;
}
