import os from 'os';
import { fs } from '@modern-js/utils';
import axios from 'axios';
import tar from 'tar';
import { getNpmTarballUrl } from './getNpmTarballUrl';
import { getNpmVersion } from './getNpmVersion';
import { fsExists } from './fsExists';
import { runInstall } from './packageManager';
import { CATCHE_VALIDITY_PREIOD } from '@/constants';

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
  tarballPkg: string,
  targetDir: string,
) {
  const response = await axios({
    method: 'get',
    url: tarballPkg,
    responseType: 'stream',
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
  } = {},
) {
  const { registryUrl, install } = options;
  // get pkgName version
  const version = await getNpmVersion(pkgName, {
    registryUrl,
    version: pkgVersion,
  });
  if (version === undefined) {
    throw new Error(`package ${pkgName}@${pkgVersion} not found in registry`);
  }
  const targetDir = `${os.tmpdir()}/csmith-generator/${pkgName}@${version}`;
  if ((await fsExists(targetDir)) && (await isValidCache(targetDir))) {
    return targetDir;
  }
  await fs.remove(targetDir);
  await fs.mkdirp(targetDir);

  // get package tarball
  const tarballPkg = await getNpmTarballUrl(pkgName, version, {
    registryUrl,
  });
  // download tarball and compress it to target directory
  await downloadAndDecompressTargz(tarballPkg, targetDir);

  if (install) {
    await runInstall(targetDir, registryUrl);
  }

  // write completed flag
  await fs.writeFile(
    `${targetDir}/.codesmith.completed`,
    new Date().toISOString(),
    { encoding: 'utf-8' },
  );

  return targetDir;
}
