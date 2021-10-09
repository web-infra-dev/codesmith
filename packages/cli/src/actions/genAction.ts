import path from 'path';
import { CodeSmith } from '@modern-js/codesmith';
import { getLocalLanguage } from '../utils';

interface LocalOptions {
  debug?: boolean;
  config: string;
  registry?: string;
  pwd?: string;
}

export async function genAction(generator: string, genOptions: LocalOptions) {
  const { debug, config, registry, pwd } = genOptions;
  const smith = new CodeSmith({
    debug,
    registryUrl: registry,
  });

  smith.logger.debug('generator', generator);
  smith.logger.debug('genOptions.debug', debug);
  smith.logger.debug('genOptions.pwd', pwd);
  smith.logger.debug('genOptions.config', config);

  let runPwd = process.cwd();
  if (pwd) {
    if (path.isAbsolute(pwd)) {
      runPwd = pwd;
      smith.logger.debug('genOptions.pwd is absolute path', pwd);
    } else {
      runPwd = path.join(process.cwd(), pwd);
      smith.logger.debug('genOptions.pwd is relative path', pwd);
    }
  }

  let targetConfig: Record<string, unknown> = {};
  try {
    targetConfig = JSON.parse(config);
  } catch (e) {
    smith.logger.error('Bad json for config: ', genOptions.config);
    return;
  }

  const tasks = [
    {
      name: generator,
      config: {
        locale: getLocalLanguage(),
        ...targetConfig,
      },
    },
  ];

  await smith.forge({
    tasks: tasks.map(runner => ({
      generator: runner.name,
      config: runner.config,
    })),
    pwd: runPwd,
  });
}
