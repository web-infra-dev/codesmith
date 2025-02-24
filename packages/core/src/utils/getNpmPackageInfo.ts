import { NPM_API_TIMEOUT } from '@/constants';
import { execa } from '@modern-js/codesmith-utils/execa';
import axios from 'axios';
import type { ILogger } from '../logger/constants';
import { getNpmRegistry } from './getNpmRegistry';
import { timeoutPromise } from './timeoutPromise';

interface Options {
  registryUrl?: string;
  logger?: ILogger;
}

interface PackageInfo {
  version: string;
  dist: {
    tarball: string;
  };
}

const NpmPackageInfoCache = new Map<string, PackageInfo>();

async function getNpmPackageInfoWithCommand(
  pkgName: string,
  pkgVersion: string,
  options?: Options,
): Promise<PackageInfo> {
  const { registryUrl } = options || {};
  const params = [
    'view',
    `${pkgName}@${pkgVersion}`,
    'dist',
    'version',
    '--json',
  ];

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
    return pkgDistInfo;
  } catch (e) {
    throw new Error(
      `Version \`${pkgVersion}\` for package \`${pkgName}\` could not be found`,
    );
  }
}

export async function getNpmPackageInfo(
  pkgName: string,
  pkgVersion: string,
  options?: Options,
): Promise<PackageInfo> {
  const packageName = `${pkgName}@${pkgVersion}`;
  const packageInfo = NpmPackageInfoCache.get(packageName);
  if (packageInfo) {
    return packageInfo;
  }
  const { registryUrl = await getNpmRegistry(), logger } = options || {};

  const url = `${registryUrl.replace(/\/$/, '')}/${pkgName}/${pkgVersion || 'latest'}`;

  let response: PackageInfo;
  try {
    response = (
      await timeoutPromise(
        axios.get(url),
        NPM_API_TIMEOUT,
        `Get npm package info of '${pkgName}'`,
      )
    ).data;
    if (!response.version) {
      response = await getNpmPackageInfoWithCommand(
        pkgName,
        pkgVersion,
        options,
      );
    }
  } catch (e) {
    logger?.error(e);
    response = await getNpmPackageInfoWithCommand(pkgName, pkgVersion, options);
  }

  const { version } = response;

  NpmPackageInfoCache.set(`${pkgName}@${version || pkgVersion}`, response);

  return response;
}
