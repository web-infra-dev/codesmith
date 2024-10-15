import { type ExecaReturnValue, execa } from '@modern-js/codesmith-utils/execa';
import {
  canUseNpm,
  canUsePnpm,
  canUseYarn,
} from '@modern-js/codesmith-utils/npm';

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

export async function runInstallWithNvm(
  command: string,
  options: Record<string, any>,
): Promise<ExecaReturnValue> {
  return await execa(`~/.nvm/nvm-exec ${command}`, {
    ...options,
    shell: true,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
}

export async function npmInstall({
  cwd,
  registryUrl,
  ignoreScripts,
  useNvm,
}: {
  cwd: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
  useNvm?: boolean;
}): Promise<ExecaReturnValue> {
  const canUse = await canUseNpm();
  if (canUse) {
    const params = ['install'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    if (ignoreScripts) {
      params.push('--ignore-scripts');
    }
    if (useNvm) {
      return runInstallWithNvm(`npm ${params.join(' ')}`, {
        cwd,
        env: process.env,
      });
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
  useNvm,
}: {
  cwd: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
  useNvm?: boolean;
}): Promise<ExecaReturnValue> {
  const canUse = await canUseYarn();
  if (canUse) {
    const params = ['install'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    if (ignoreScripts) {
      params.push('--ignore-scripts');
    }
    if (useNvm) {
      return runInstallWithNvm(`yarn ${params.join(' ')}`, {
        cwd,
        env: process.env,
      });
    }
    return execaWithStreamLog('yarn', params, { cwd, env: process.env });
  }
  throw new Error('please install yarn first');
}

export async function pnpmInstall({
  cwd,
  registryUrl,
  ignoreScripts,
  useNvm,
}: {
  cwd: string;
  registryUrl?: string;
  ignoreScripts?: boolean;
  useNvm?: boolean;
}): Promise<ExecaReturnValue> {
  const canUse = await canUsePnpm();
  if (canUse) {
    const params = ['install'];
    if (registryUrl) {
      params.push(`--registry=${registryUrl}`);
    }
    if (ignoreScripts) {
      params.push('--ignore-scripts');
    }
    if (useNvm) {
      return runInstallWithNvm(`yarn ${params.join(' ')}`, {
        cwd,
        env: process.env,
      });
    }
    return execaWithStreamLog('pnpm', params, { cwd, env: process.env });
  }
  throw new Error('please install pnpm first');
}
