import { Command } from '@modern-js/utils';
import { genAction } from './actions/genAction';

export default function () {
  const program = new Command();

  program
    .command('gen <generator>', { isDefault: true })
    .description('use csmith to generator something')
    .option('-d,--debug', 'using debug mode to log something', false)
    .option('-p,--pwd <pwd>', 'process working directory', process.cwd())
    .option('--config <config>', 'config for this generator(json string)', '{}')
    .option(
      '--registry <registry>',
      'set npm registry url to run npm command',
      false,
    )
    .action(genAction);

  program.parse(process.argv);
}
