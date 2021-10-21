import { downloadPackage } from '@/utils';

describe('downloadPackage function test', () => {
  it('download lodash package', async () => {
    const packageDir = await downloadPackage('lodash');
    expect(packageDir).toContain('csmith-generator/lodash');
  });
});
