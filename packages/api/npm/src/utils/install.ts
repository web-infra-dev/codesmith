import execa from 'execa';
import { canUseNpm, canUsePnpm, canUseYarn } from './env';

export async function npmInstall(cwd: string, registryUrl?: string) {
  const canUse = await canUseNpm();
  if (canUse) {
    const params = ['install', '--ignore-scripts'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    const installPromise = execa('npm', params, {
      cwd,
      env: process.env,
    });
    installPromise.stdout?.pipe(process.stdout);
    return installPromise;
  }
  throw new Error('please install npm first');
}

export async function yarnInstall(cwd: string, registryUrl?: string) {
  const canUse = await canUseYarn();
  if (canUse) {
    const params = ['install', '--ignore-scripts'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    const installPromise = execa('yarn', params, { cwd, env: process.env });
    installPromise.stdout?.pipe(process.stdout);
    return installPromise;
  }
  throw new Error('please install yarn first');
}

export async function pnpmInstall(cwd: string, registryUrl?: string) {
  const canUse = await canUsePnpm();
  if (canUse) {
    const params = ['install', '--ignore-scripts'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    const installPromise = execa('pnpm', params, { cwd, env: process.env });
    installPromise.stdout?.pipe(process.stdout);
    return installPromise;
  }
  throw new Error('please install pnpm first');
}
