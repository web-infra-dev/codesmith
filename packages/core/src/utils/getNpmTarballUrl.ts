import { NPM_API_TIMEOUT } from '@/constants';
import { execa } from '@modern-js/utils';
import { timeoutPromise } from './timeoutPromise';

interface Options {
  registryUrl?: string;
}

export async function getNpmTarballUrl(
  pkgName: string,
  pkgVersion: string,
  options?: Options,
): Promise<string> {
  const { registryUrl } = options || {};
  const params = ['view', `${pkgName}@${pkgVersion}`, 'dist', '--json'];

  if (registryUrl) {
    params.push('--registry');
    params.push(registryUrl);
  }

  const getPkgInfoPromise = execa('npm', params);
  const { stdout } = await timeoutPromise(
    getPkgInfoPromise,
    NPM_API_TIMEOUT,
    `Get npm tarball of '${pkgName}'`,
  );

  try {
    const pkgDistInfo = JSON.parse(stdout);
    return pkgDistInfo.tarball;
  } catch (e) {
    throw new Error(
      `Version \`${pkgVersion}\` for package \`${pkgName}\` could not be found`,
    );
  }
}
