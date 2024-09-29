import os from 'os';
import { CATCHE_VALIDITY_PREIOD } from '@/constants';
import type { Logger } from '@/logger';
import type { ILogger } from '@/logger/constants';
import { fs, semver } from '@modern-js/utils';
import pacote from 'pacote';
import { fsExists } from './fsExists';
import { getNpmVersion } from './getNpmVersion';
import { runInstall } from './packageManager';

async function isValidCache(cacheDir: string) {
  /* generator cache can use
   * 1. .codesmith.completed exist
   * 2. cache time is within the validity period
   */
  if (await fsExists(`${cacheDir}/.codesmith.completed`)) {
    const preCacheTimeStr = await fs.readFile(
      `${cacheDir}/.codesmith.completed`,
      {
        encoding: 'utf-8',
      },
    );
    const preCacheTime = preCacheTimeStr
      ? new Date(preCacheTimeStr)
      : new Date(0);
    if (Number(new Date()) - Number(preCacheTime) < CATCHE_VALIDITY_PREIOD) {
      return true;
    }
    return false;
  }
  return false;
}

async function downloadAndDecompressTargz(
  packageName: string,
  version: string,
  targetDir: string,
  registryUrl?: string,
): Promise<void> {
  await pacote.extract(`${packageName}@${version}`, targetDir, {
    registry: registryUrl,
  });
}

const GeneratorVersionMap = new Map<string, string>();

export async function getGeneratorVersion(
  pkgName: string,
  pkgVersion = 'latest',
  options: {
    registryUrl?: string;
    install?: boolean;
    logger?: ILogger;
  } = {},
): Promise<string> {
  const cacheKey = `${pkgName}@${pkgVersion}`;
  const cachedVersion = GeneratorVersionMap.get(cacheKey);
  if (cachedVersion) {
    return cachedVersion;
  }

  const { registryUrl, logger } = options;
  let version: string;

  if (semver.valid(pkgVersion)) {
    version = pkgVersion;
  } else {
    logger?.timing(`🕒 get ${pkgName} version`);
    try {
      version = await getNpmVersion(pkgName, {
        registryUrl,
        version: pkgVersion,
      });
    } catch (error: any) {
      throw new Error(
        `Failed to get version for package ${pkgName}@${pkgVersion}: ${error.message}`,
      );
    } finally {
      logger?.timing(`🕒 get ${pkgName} version`, true);
    }

    if (!version) {
      throw new Error(`Package ${pkgName}@${pkgVersion} not found in registry`);
    }
  }

  GeneratorVersionMap.set(cacheKey, version);
  return version;
}

/**
 * download npm package
 * @param {string} pkgName
 * @param {string} pkgVersion
 * @param {string} registryUrl
 * @returns void
 */
export async function downloadPackage(
  pkgName: string,
  pkgVersion = 'latest',
  options: {
    registryUrl?: string;
    install?: boolean;
    logger?: Logger;
  } = {},
) {
  const { registryUrl, install, logger } = options;
  const version = await getGeneratorVersion(pkgName, pkgVersion, {
    registryUrl,
    logger,
  });
  const targetDir = `${os.tmpdir()}/csmith-generator/${pkgName}@${version}`;
  logger?.debug?.(
    `💡 [Download Generator Package]: ${pkgName}@${version} to ${targetDir}`,
  );
  if ((await fsExists(targetDir)) && (await isValidCache(targetDir))) {
    return targetDir;
  }
  await fs.remove(targetDir);
  await fs.mkdirp(targetDir);

  logger?.timing(`🕒 download ${pkgName}@${version} tarball`);
  // download tarball and compress it to target directory
  await downloadAndDecompressTargz(pkgName, version, targetDir, registryUrl);
  logger?.timing(`🕒 download ${pkgName}@${version} tarball`, true);

  if (install) {
    logger?.timing(`🕒 install ${pkgName}@${version}`);
    await runInstall(targetDir, registryUrl, logger);
    logger?.timing(`🕒 install ${pkgName}@${version}`, true);
  }

  logger?.timing(`🕒 write ${pkgName}@${version} cache`);
  // write completed flag
  await fs.writeFile(
    `${targetDir}/.codesmith.completed`,
    new Date().toISOString(),
    { encoding: 'utf-8' },
  );
  logger?.timing(`🕒 write ${pkgName}@${version} cache`, true);

  return targetDir;
}
