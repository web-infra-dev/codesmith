import { getNpmVersion } from '@/utils';

describe.skip('getNpmVersion function test', () => {
  it('package exists', async () => {
    const version = await getNpmVersion('lodash');
    expect(typeof version).toBe('string');
  });
  it('package not exists', async () => {
    try {
      await getNpmVersion('lodash_xx');
    } catch (e: any) {
      expect(e.message).toContain(`lodash_xx@latest' is not in this registry`);
    }
  });
});
