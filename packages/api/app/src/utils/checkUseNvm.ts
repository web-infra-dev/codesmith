import path from 'path';
import { fsExists, ILogger } from '@modern-js/codesmith';
import { execa, fs, semver } from '@modern-js/utils';
import { canUseNvm } from '@modern-js/codesmith-api-npm';
import { execaWithStreamLog } from '@modern-js/codesmith-api-npm/dist/types/utils/install';

const NODE_VERSION_MAP: Record<string, string> = {
  'lts/*': '18.12.1',
  'lts/argon': '4.9.1',
  'lts/boron': '6.17.1',
  'lts/carbon': '8.17.0',
  'lts/dubnium': '10.24.1',
  'lts/erbium': '12.22.12',
  'lts/fermium': '14.21.2',
  'lts/gallium': '16.19.0',
  'lts/hydrogen': '18.12.1',
};

export async function getNoteVersion() {
  const result = await execa('node', ['--version']);
  return result.stdout.slice(1);
}
export async function checkUseNvm(cwd: string, logger: ILogger) {
  // exist .nvmrc file
  if (!(await fsExists(path.join(cwd, '.nvmrc')))) {
    return false;
  }
  // check current node version and expect node version
  const nvmrcContent = await fs.readFile(path.join(cwd, '.nvmrc'), 'utf-8');
  const expectNodeVersion = NODE_VERSION_MAP[nvmrcContent] || nvmrcContent;
  const currentNodeVersion = await getNoteVersion();
  if (semver.major(expectNodeVersion) === semver.major(currentNodeVersion)) {
    return false;
  }
  // check nvm exist
  if (!(await canUseNvm())) {
    logger.warn(
      `current node version is not expect, you should install ${expectNodeVersion}`,
    );
    return false;
  }
  // run nvm install
  try {
    await execaWithStreamLog('nvm', ['install'], {});
    return true;
  } catch (e) {
    return false;
  }
}
