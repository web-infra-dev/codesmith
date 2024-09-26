import { NPM_API_TIMEOUT } from '@/constants';
import axios from 'axios';
import { timeoutPromise } from './timeoutPromise';

/**
 * get package version
 * @param {string} packageName
 * @param {Options} options
 * @returns {string}
 */

interface Options {
  registryUrl?: string;
  version?: string;
}

export async function getNpmVersion(
  packageName: string,
  options?: Options,
): Promise<string> {
  const { version = 'latest', registryUrl = 'https://registry.npmjs.org' } =
    options || {};

  const url = `${registryUrl}/${packageName}/${version}`;

  const response = await timeoutPromise(
    axios.get(url),
    NPM_API_TIMEOUT,
    `Get npm version of '${packageName}'`,
  );

  return response.data.version;
}
