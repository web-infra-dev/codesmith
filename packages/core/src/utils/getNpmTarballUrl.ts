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
