import { NPM_API_TIMEOUT } from '@/constants';
import { execa } from '@modern-js/utils';
import { timeoutPromise } from './timeoutPromise';

/**
 * get package version
 * @param {string} packageName
 * @param {Options} options
 * @returns {string}
 */

interface Options {
  registryUrl?: string;
  version: string;
}

export async function getNpmVersion(
  packageName: string,
  options?: Options,
): Promise<string | undefined> {
  const { version, registryUrl } = options || {};
  const params = ['view'];
  if (version) {
    params.push(`${packageName}@${version}`);
  } else {
    params.push(packageName);
  }

  params.push('version');

  if (registryUrl) {
    params.push('--registry');
    params.push(registryUrl);
  }

  const getPkgInfoPromise = execa('npm', params);
  const { stdout } = await timeoutPromise(
    getPkgInfoPromise,
    NPM_API_TIMEOUT,
    `Get npm version of '${packageName}'`,
  );
  return stdout;
}
