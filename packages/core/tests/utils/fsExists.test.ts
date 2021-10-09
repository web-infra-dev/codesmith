import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { fsExists } from '@/utils';

describe('fsExists function test', () => {
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