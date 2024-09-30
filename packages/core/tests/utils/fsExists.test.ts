import os from 'os';
import path from 'path';
import { fsExists } from '@/utils';
import { fs } from '@modern-js/codesmith-utils/fs-extra';

describe('fsExists function test', () => {
  beforeEach(() => {
    const tmpDir = os.tmpdir();
    fs.removeSync(path.join(tmpDir, '_codesmith_test'));
  });

  it('file exists', async () => {
    const tmpDir = os.tmpdir();
    const fileName = 'tmp.txt';
    const filePath = path.join(tmpDir, '_codesmith_test', fileName);
    await fs.createFile(filePath);
    const exists = await fsExists(filePath);
    expect(exists).toBe(true);
  });
  it('file not exists', async () => {
    const tmpDir = os.tmpdir();
    const fileName = 'tmp_not_exit.txt';
    const filePath = path.join(tmpDir, '_codesmith_test', fileName);
    const exists = await fsExists(filePath);
    expect(exists).toBe(false);
  });
  afterAll(() => {
    const tmpDir = os.tmpdir();
    const dirPath = path.join(tmpDir, '_codesmith_test');
    fs.remove(dirPath);
  });
});
