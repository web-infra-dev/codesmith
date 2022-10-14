import { execa } from '@modern-js/utils';
import { canUseNpm, canUsePnpm, canUseYarn } from './env';

export function execaWithStreamLog(
  command: string,
  args: string[],
  options: Record<string, any>,
) {
  const promise = execa(command, args, {
    ...options,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  return promise;
}

export async function npmInstall({
  cwd,
  registryUrl,
  ignoreScripts,
}: {
  cwd: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
}) {
  const canUse = await canUseNpm();
  if (canUse) {
    const params = ['install'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    if (ignoreScripts) {
      params.push('--ignore-scripts');
    }
    return execaWithStreamLog('npm', params, {
      cwd,
      env: process.env,
    });
  }
  throw new Error('please install npm first');
}

export async function yarnInstall({
  cwd,
  registryUrl,
  ignoreScripts,
}: {
  cwd: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
}) {
  const canUse = await canUseYarn();
  if (canUse) {
    const params = ['install'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    if (ignoreScripts) {
      params.push('--ignore-scripts');
    }
    return execaWithStreamLog('yarn', params, { cwd, env: process.env });
  }
  throw new Error('please install yarn first');
}

export async function pnpmInstall({
  cwd,
  registryUrl,
  ignoreScripts,
}: {
  cwd: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
}) {
  const canUse = await canUsePnpm();
  if (canUse) {
    const params = ['install'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    if (ignoreScripts) {
      params.push('--ignore-scripts');
    }
    return execaWithStreamLog('pnpm', params, { cwd, env: process.env });
  }
  throw new Error('please install pnpm first');
}
