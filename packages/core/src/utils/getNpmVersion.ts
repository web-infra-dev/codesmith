import { getNpmPackageInfo } from './getNpmPackageInfo';

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
  const { version = 'latest' } = options || {};
  const packageInfo = await getNpmPackageInfo(packageName, version, options);

  return packageInfo.version;
}
