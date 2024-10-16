import { NPM_API_TIMEOUT } from '@/constants';
import axios from 'axios';
import { timeoutPromise } from './timeoutPromise';
import { getNpmRegistry } from './getNpmRegistry';

interface Options {
  registryUrl?: string;
}

interface PackageInfo {
  version: string;
  dist: {
    tarball: string;
  };
}

const NpmPackageInfoCache = new Map<string, PackageInfo>();

export async function getNpmPackageInfo(
  pkgName: string,
  pkgVersion: string,
  options?: Options,
): Promise<PackageInfo> {
  const packageName = `${pkgName}/${pkgVersion}`;
  const packageInfo = NpmPackageInfoCache.get(packageName);
  if (packageInfo) {
    return packageInfo;
  }
  const { registryUrl = await getNpmRegistry() } = options || {};

  const url = `${registryUrl}/${pkgName}/${pkgVersion}`;

  const response = await timeoutPromise(
    axios.get(url),
    NPM_API_TIMEOUT,
    `Get npm package info of '${pkgName}'`,
  );

  NpmPackageInfoCache.set(packageName, response.data);

  return response.data;
}
