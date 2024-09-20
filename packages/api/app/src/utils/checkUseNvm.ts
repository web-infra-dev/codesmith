import path from 'path';
import { type ILogger, fsExists } from '@modern-js/codesmith';
import { canUseNvm, execaWithStreamLog } from '@modern-js/codesmith-api-npm';
import { fs, execa, semver } from '@modern-js/utils';

const NODE_MAJOR_VERSION_MAP: Record<string, number> = {
  'lts/*': 18,
  'lts/argon': 4,
  'lts/boron': 6,
  'lts/carbon': 8,
  'lts/dubnium': 10,
  'lts/erbium': 12,
  'lts/fermium': 14,
  'lts/gallium': 16,
  'lts/hydrogen': 18,
};

export async function getNoteVersion() {
  const result = await execa('node', ['--version']);
  return result.stdout.slice(1);
}
export async function checkUseNvm(cwd: string, logger: ILogger) {
  // check windows
  if (process.platform.startsWith('win')) {
    return false;
  }
  // exist .nvmrc file
  if (!(await fsExists(path.join(cwd, '.nvmrc')))) {
    return false;
  }
  // check current node version and expect node version
  const nvmrcContent = (
    await fs.readFile(path.join(cwd, '.nvmrc'), 'utf-8')
  ).replace('\n', '');
  const expectNodeVersion =
    NODE_MAJOR_VERSION_MAP[nvmrcContent] || nvmrcContent;
  const currentNodeVersion = await getNoteVersion();
  if (expectNodeVersion === semver.major(currentNodeVersion)) {
    return false;
  }
  // check nvm exist
  if (!(await canUseNvm())) {
    logger.warn(
      `[Check nvm Error]: Current node version is not expect, you should install ${expectNodeVersion}`,
    );
    return false;
  }
  // run nvm install
  try {
    await execaWithStreamLog('source ~/.nvm/nvm.sh && nvm install', [], {
      shell: true,
      cwd,
    });
    return true;
  } catch (e) {
    return false;
  }
}
