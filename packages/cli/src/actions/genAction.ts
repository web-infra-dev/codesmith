import path from 'path';
import { CodeSmith } from '@modern-js/codesmith';
import { getLocalLanguage } from '../utils';

interface LocalOptions {
  debug?: boolean;
  time?: boolean;
  config: string;
  registry?: string;
  pwd?: string;
}

export async function genAction(generator: string, genOptions: LocalOptions) {
  const { debug, time, config, registry, pwd } = genOptions;
  const smith = new CodeSmith({
    debug,
    time,
    registryUrl: registry,
  });

  smith.logger.debug('💡 [Runtime Gen Action]');
  smith.logger.debug('💡 [Generator Name]:', generator);
  smith.logger.debug('💡 [Generator Pwd]:', pwd);
  smith.logger.debug('💡 [Generator Debug]:', debug);
  smith.logger.debug('💡 [Generator Options]:', config);

  let runPwd = process.cwd();
  if (pwd) {
    if (path.isAbsolute(pwd)) {
      runPwd = pwd;
      smith.logger.debug('💡 [PWD is Absolute Path]:', pwd);
    } else {
      runPwd = path.join(process.cwd(), pwd);
      smith.logger.debug('💡 [PWD is Relative Path]:', pwd);
    }
  }

  let targetConfig: Record<string, unknown> = {};
  try {
    targetConfig = JSON.parse(config);
  } catch (e) {
    smith.logger.error('🔴 [Config Parse Error]:', e);
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
