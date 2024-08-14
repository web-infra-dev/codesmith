import os from 'os';
import path from 'path';
import { downloadPackage } from '@/utils';
import { fs } from '@modern-js/utils';

jest.setTimeout(100000);

describe('downloadPackage function test', () => {
  beforeEach(() => {
    fs.removeSync(path.join(os.tmpdir(), 'csmith-generator'));
  });
  it.skip('download lodash package', async () => {
    const packageDir = await downloadPackage('lodash');
    expect(packageDir).toContain('csmith-generator/lodash');
  });
});
