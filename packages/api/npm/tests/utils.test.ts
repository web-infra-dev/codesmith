import os from 'os';
import path from 'path';
import { canUseNpm, canUseNvm, canUseYarn } from '@/utils/env';
import {
  execaWithStreamLog,
  npmInstall,
  pnpmInstall,
  yarnInstall,
} from '@/utils/install';
import { fs } from '@modern-js/codesmith-utils/fs-extra';

describe('Env utils cases', () => {
  test('can use nvm', async () => {
    const result = await canUseNvm();
    expect(typeof result === 'boolean').toBeTruthy();
  });
  test('can use npm', async () => {
    const result = await canUseNpm();
    expect(typeof result === 'boolean').toBeTruthy();
  });
  test('can use yarn', async () => {
    const result = await canUseYarn();
    expect(typeof result === 'boolean').toBeTruthy();
  });
  test('can use yarn', async () => {
    const result = await canUseYarn();
    expect(typeof result === 'boolean').toBeTruthy();
  });
});

const cwd = path.join(os.tmpdir(), 'codesmith_test', Math.random().toString());

describe('Install cases', () => {
  beforeEach(async () => {
    await fs.mkdirp(cwd);
    const packageJson = {
      name: 'test-npm',
      version: '0.1.0',
      private: true,
      dependencies: {
        lodash: '^4',
      },
    };
    await fs.writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify(packageJson),
      { encoding: 'utf-8' },
    );
  });
  afterEach(async () => {
    await fs.remove(cwd);
  });
  test('npm install', async () => {
    const result = await npmInstall({ cwd });
    expect(result?.exitCode).toBe(0);
    expect(fs.existsSync(path.join(cwd, 'node_modules', 'lodash'))).toBe(true);
  });
  test('yarn install', async () => {
    if (!(await canUseYarn())) {
      await execaWithStreamLog('npm', ['install', '-g', 'yarn'], {});
    }
    const result = await yarnInstall({ cwd });
    expect(result?.exitCode).toBe(0);
    expect(fs.existsSync(path.join(cwd, 'node_modules', 'lodash'))).toBe(true);
  });
  test('pnpm install', async () => {
    const result = await pnpmInstall({ cwd });
    expect(result?.exitCode).toBe(0);
    expect(fs.existsSync(path.join(cwd, 'node_modules', 'lodash'))).toBe(true);
  });
});
