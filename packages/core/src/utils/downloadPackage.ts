import os from 'os';
import { CATCHE_VALIDITY_PREIOD } from '@/constants';
import type { Logger } from '@/logger';
import type { ILogger } from '@/logger/constants';
import { fs } from '@modern-js/codesmith-utils/fs-extra';
import { semver } from '@modern-js/codesmith-utils/semver';
import axios from 'axios';
import tar from 'tar';
import { fsExists } from './fsExists';
import { getNpmTarballUrl } from './getNpmTarballUrl';
import { getNpmVersion } from './getNpmVersion';
import { runInstall } from './packageManager';

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

async function isValidCache(cacheDir: string, pkgName: string) {
  /* generator cache can use
   * 1. .codesmith.completed exist
   * 2. cache time is within the validity period
   * 3. 对于 @modern-js/codesmith-global 包，缓存一直有效
   */
  if (await fsExists(`${cacheDir}/.codesmith.completed`)) {
    if (pkgName === '@modern-js/codesmith-global') {
      return true;
    }
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
  tarballPkg: string,
  targetDir: string,
) {
  const response = await axios({
    method: 'get',
    url: tarballPkg,
    responseType: 'stream',
    adapter: 'http',
  });
  if (response.status !== 200) {
    throw new Error(
      `download tar package get bad status code: ${response.status}`,
    );
  }
  // create tmp file
  const randomId = Math.floor(Math.random() * 10000);
  const tempTgzFilePath = `${os.tmpdir()}/temp-${randomId}.tgz`;

  const dest = fs.createWriteStream(tempTgzFilePath);

  await new Promise<void>((resolve, reject) => {
    response.data.pipe(dest);
    response.data.on('error', (err: any) => {
      reject(err);
    });
    dest.on('finish', () => {
      resolve();
    });
  });
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(tempTgzFilePath)
      .pipe(
        tar.x({
          strip: 1,
          C: `${targetDir}`,
        }),
      )
      .on('finish', () => {
        resolve();
      })
      .on('error', (err: any) => {
        reject(err);
      });
  });
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
  let version: string | undefined;
  if (!semver.valid(pkgVersion)) {
    // get pkgName version
    logger?.timing(`🕒 get ${pkgName} version`);
    version = await getNpmVersion(pkgName, {
      registryUrl,
      version: pkgVersion,
    });
    logger?.timing(`🕒 get ${pkgName} version`, true);
    if (version === undefined) {
      throw new Error(`package ${pkgName}@${pkgVersion} not found in registry`);
    }
  } else {
    version = pkgVersion;
  }
  const targetDir = `${os.tmpdir()}/csmith-generator/${pkgName}@${version}`;
  logger?.debug?.(
    `💡 [Download Generator Package]: ${pkgName}@${version} to ${targetDir}`,
  );
  if ((await fsExists(targetDir)) && (await isValidCache(targetDir, pkgName))) {
    return targetDir;
  }
  await fs.remove(targetDir);
  await fs.mkdirp(targetDir);

  logger?.timing(`🕒 get ${pkgName}@${version} tarball url`);
  // get package tarball
  const tarballPkg = await getNpmTarballUrl(pkgName, version, {
    registryUrl,
  });
  logger?.timing(`🕒 get ${pkgName}@${version} tarball url`, true);

  logger?.timing(`🕒 download ${pkgName}@${version} tarball`);
  // download tarball and compress it to target directory
  await downloadAndDecompressTargz(tarballPkg, targetDir);
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
