import path from 'path';
import type { Logger } from '@/logger';
import { execa } from '@modern-js/codesmith-utils/execa';
import { fs } from '@modern-js/codesmith-utils/fs-extra';

export async function canUseYarn() {
  try {
    await execa('yarn', ['--version'], {
      env: process.env,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function canUsePnpm() {
  try {
    await execa('pnpm', ['--version'], {
      env: process.env,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function runInstall(
  targetDir: string,
  registryUrl?: string,
  logger?: Logger,
) {
  const options = {
    cwd: targetDir,
    env: process.env,
  };
  // delete devDependencies
  try {
    const pkgPath = path.join(targetDir, 'package.json');
    const pkgJSON = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf-8' }));
    pkgJSON.devDependencies = undefined;
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJSON, null, 2), {
      encoding: 'utf-8',
    });
  } catch (e) {
    /**
     * no handle
     */
  }

  const showLog = logger?.level === 'debug';

  if (await canUsePnpm()) {
    const params = [
      'install',
      '--prod',
      showLog ? null : '--reporter=silent', // if debug mode, console install log
      '--ignore-scripts',
    ].filter(Boolean) as string[];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    await execa('pnpm', params, options);
  } else if (await canUseYarn()) {
    const params = [
      'install',
      '--production',
      showLog ? null : '--silent',
      '--ignore-scripts',
    ].filter(Boolean) as string[];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    await execa('yarn', params, options);
  } else {
    const params = [
      'install',
      '--production',
      '--loglevel=error',
      '--ignore-scripts',
    ];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    await execa('npm', params, options);
  }
}
