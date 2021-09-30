import { Command } from 'commander';
import { build } from './commands';

export default function () {
  const program = new Command();

  program
    .command('build')
    .description('use webpack to build codesmith generator')
    .action(build);

  program.parse(process.argv);
}
