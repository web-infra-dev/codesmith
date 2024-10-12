import { semver } from '@modern-js/codesmith-utils/semver';

/**
 * get package name and package version from package name string
 * @param {string} packageName
 * @returns {name: string, version: string}
 */
export function getPackageInfo(packageName: string) {
  if (!packageName) {
    throw new Error('package is not exisit');
  }
  const splitAt = packageName.split('@');
  let pkgVersion = 'latest';
  let pkgName = packageName;
  if (
    (!packageName.startsWith('@') && splitAt.length === 2) ||
    (packageName.startsWith('@') && splitAt.length === 3)
  ) {
    const semverValid = semver.valid(splitAt[splitAt.length - 1]);
    if (semverValid === null) {
      pkgVersion = splitAt[splitAt.length - 1];
      pkgName = packageName.slice(0, packageName.lastIndexOf('@'));
    } else {
      pkgVersion = semverValid;
      pkgName = packageName.split(semverValid)[0].slice(0, -1);
    }
  }
  return {
    name: pkgName,
    version: pkgVersion,
  };
}
