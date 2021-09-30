import execa from 'execa';
import { canUseNpm, canUsePnpm, canUseYarn } from './env';

export async function npmInstall(cwd: string, registryUrl?: string) {
  const canUse = await canUseNpm();
  if (canUse) {
    const params = ['install', '--loglevel', 'error'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    return execa('npm', params, {
      cwd,
      env: process.env,
    });
  }
  throw new Error('please install npm first');
}

export async function yarnInstall(cwd: string, registryUrl?: string) {
  const canUse = await canUseYarn();
  if (canUse) {
    const params = ['install', '--slient'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    return execa('yarn', params, { cwd, env: process.env });
  }
  throw new Error('please install yarn first');
}

export async function pnpmInstall(cwd: string, registryUrl?: string) {
  const canUse = await canUsePnpm();
  if (canUse) {
    const params = ['install'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    return execa('pnpm', params, { cwd, env: process.env });
  }
  throw new Error('please install pnpm first');
}
