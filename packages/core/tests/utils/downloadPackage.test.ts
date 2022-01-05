import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { downloadPackage } from '@/utils';

jest.setTimeout(100000);

describe('downloadPackage function test', () => {
  beforeEach(() => {
    fs.removeSync(path.join(os.tmpdir(), 'csmith-generator'));
  });
  it('download lodash package', async () => {
    const packageDir = await downloadPackage('lodash');
    expect(packageDir).toContain('csmith-generator/lodash');
  });
});
