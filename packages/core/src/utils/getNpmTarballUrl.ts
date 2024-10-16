import { NPM_API_TIMEOUT } from '@/constants';
import axios from 'axios';
import { timeoutPromise } from './timeoutPromise';
import { getNpmRegistry } from './getNpmRegistry';
import { getNpmPackageInfo } from './getNpmPackageInfo';

interface Options {
  registryUrl?: string;
}

export async function getNpmTarballUrl(
  pkgName: string,
  pkgVersion: string,
  options?: Options,
): Promise<string> {
  const packageInfo = await getNpmPackageInfo(pkgName, pkgVersion, options);

  return packageInfo.dist.tarball;
}
