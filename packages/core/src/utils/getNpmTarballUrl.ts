import { NPM_API_TIMEOUT } from '@/constants';
import axios from 'axios';
import { timeoutPromise } from './timeoutPromise';

interface Options {
  registryUrl?: string;
}

export async function getNpmTarballUrl(
  pkgName: string,
  pkgVersion: string,
  options?: Options,
): Promise<string> {
  const { registryUrl = 'https://registry.npmjs.org' } = options || {};

  const url = `${registryUrl}/${pkgName}/${pkgVersion}`;

  const response = await timeoutPromise(
    axios.get(url),
    NPM_API_TIMEOUT,
    `Get npm tarball of '${pkgName}'`,
  );

  return response.data.dist.tarball;
}
